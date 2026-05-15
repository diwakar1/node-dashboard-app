# =============================================================================
# Multi-stage production build
# Final image: single container — Node.js backend serves both the REST API
# and the pre-built React static files.
# =============================================================================

# ── Stage 1: Build @dashboard/shared TypeScript package ──────────────────────
FROM node:20-alpine AS shared-builder
WORKDIR /workspace/shared
COPY shared/package.json shared/tsconfig.json ./
COPY shared/src ./src/
RUN npm install && npm run build


# ── Stage 2: Build React frontend ────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder
WORKDIR /workspace

# Bring in shared (only package.json + compiled dist needed for npm install)
COPY --from=shared-builder /workspace/shared/package.json ./shared/package.json
COPY --from=shared-builder /workspace/shared/dist        ./shared/dist

COPY frontend/package.json ./frontend/
RUN cd frontend && npm install

COPY frontend/ ./frontend/

# VITE_API_URL can be passed as a build-arg for deployments where the API
# lives on a different origin. Leave empty when backend serves the frontend
# (same-origin — relative API paths are used automatically).
ARG VITE_API_URL=""
ENV VITE_API_URL=${VITE_API_URL}

WORKDIR /workspace/frontend
RUN npm run build


# ── Stage 3: Production backend ──────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /workspace

# Shared: only the built artefacts needed at runtime
COPY --from=shared-builder /workspace/shared/package.json ./shared/package.json
COPY --from=shared-builder /workspace/shared/dist         ./shared/dist

# Install backend production dependencies
# npm resolves "file:../shared" to /workspace/shared — populated above
COPY backend/package.json ./backend/
RUN cd backend && npm install --omit=dev

# Copy backend source (node_modules is already installed above)
COPY backend/ ./backend/

# Place the frontend build where index.js expects it: ../frontend/build
COPY --from=frontend-builder /workspace/frontend/build ./frontend/build

WORKDIR /workspace/backend
ENV NODE_ENV=production
EXPOSE 5000
CMD ["node", "index.js"]

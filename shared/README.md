# Shared Types

Shared TypeScript types and interfaces for the Dashboard application.

## Setup Steps

```bash
# 1. Build shared package
cd shared
npm install
npm run build

# 2. Install in backend
cd ../backend
npm install

# 3. Install in frontend
cd ../frontend
npm install

# 4. Run backend and frontend
cd ../backend && npm start
cd ../frontend && npm run dev
```

**Note:** Rebuild shared (`npm run build`) whenever you modify type definitions in `src/types/`, then restart backend/frontend.

## Structure

```
shared/
├── src/
│   ├── types/
│   │   ├── Product.ts    # Product interfaces
│   │   ├── Category.ts   # Category interfaces
│   │   ├── User.ts       # User and Auth interfaces
│   │   └── Api.ts        # API response interfaces
│   └── index.ts          # Main export
├── package.json
└── tsconfig.json
```

## Usage

```javascript
// Import types
import { Product, Category, User } from '@dashboard/shared';

## complete setup
1. crate shared folder
mkdir shared
cd shared
mkdir src
mkdir src\types
2. initilize npm package
//inside shared folder
npm init -y
this creates package.json
3. install typeScript
npm install --save-dev typescript
4. create typescript configuration
create tsconfig.json
5. create .gitignore
6 create type Defination Files in src/types/
7. create src/index.ts file to export files
8. build shared package npm run build // this compiles Typescript and creates dist/ folder with .js and .d.ts files
9. link to backend 
Edit package.json add to dependencies
"dependencies": {
  "@dashboard/shared": "file:../shared",
  // ... other dependencies
}
This will install the `@dashboard/shared` package from the local `../shared` folder.
then install 
cd ..\backend
npm install
10. Link to Frontend
edit package.json add to dependencies
"dependencies": {
  "@dashboard/shared": "file:../shared",
  // ... other dependencies
}
then insall 
cd ..\frontend
npm install

 
 
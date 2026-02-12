/**
 * authController.test.js
 * Unit tests for authController using Jest and supertest.
 */

import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from '../routes/auth.js';

const app = express();
app.use(bodyParser.json());
app.use('/api/v1/auth', authRoutes);

describe('Auth Controller', () => {
    it('should return 400 for missing signup fields', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toBeDefined();
    });

    it('should return 400 for missing login fields', async () => {
        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body.errors).toBeDefined();
    });
});

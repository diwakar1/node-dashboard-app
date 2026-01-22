/**
 * userService.test.js
 * Unit tests for userService using Jest.
 */

const userService = require('../services/userService');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('../models/User');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('User Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('findUserByEmail should call User.findOne', async () => {
        User.findOne.mockResolvedValue('user');
        const result = await userService.findUserByEmail('test@test.com');
        expect(result).toBe('user');
    });

    it('createUser should hash password and save user', async () => {
        bcrypt.hash.mockResolvedValue('hashed');
        const mockSave = jest.fn().mockResolvedValue('saved');
        User.mockImplementation(() => ({ save: mockSave }));
        const result = await userService.createUser({ name: 'n', email: 'e', password: 'p' });
        expect(result).toBe('saved');
    });

    it('comparePassword should call bcrypt.compare', async () => {
        bcrypt.compare.mockResolvedValue(true);
        const result = await userService.comparePassword('plain', 'hash');
        expect(result).toBe(true);
    });

    it('generateToken should call jwt.sign', () => {
        jwt.sign.mockReturnValue('token');
        const result = userService.generateToken({ id: 1 }, 'secret');
        expect(result).toBe('token');
    });
});

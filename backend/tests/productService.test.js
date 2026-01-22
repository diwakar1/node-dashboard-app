/**
 * productService.test.js
 * Unit tests for productService using Jest.
 */

const productService = require('../services/productService');
const Product = require('../models/Product');

jest.mock('../models/Product');

describe('Product Service', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('addProduct should save a product', async () => {
        const mockProduct = { save: jest.fn().mockResolvedValue('saved') };
        Product.mockImplementation(() => mockProduct);
        const result = await productService.addProduct({ name: 'Test' });
        expect(result).toBe('saved');
    });

    it('getProducts should return products', async () => {
        Product.find.mockResolvedValue(['p1', 'p2']);
        const result = await productService.getProducts();
        expect(result).toEqual(['p1', 'p2']);
    });
});

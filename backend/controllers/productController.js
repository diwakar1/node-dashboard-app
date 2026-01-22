/**
 * productController.js
 * Handles product CRUD operations: add, get, update, delete, and search products.
 * Interacts with the Product model and responds to product-related API requests.
 */
const productService = require('../services/productService');

exports.addProduct = async (req, res) => {
    try {
        const result = await productService.addProduct(req.body);
        res.send(result);
    } catch (e) {
        res.status(500).send({ error: "Failed to add product", detail: e.message });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await productService.getProducts();
        if (products.length > 0) {
            res.send(products);
        } else {
            res.send({ result: "no products found" });
        }
    } catch (e) {
        res.status(500).send({ error: "Failed to fetch products", detail: e.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const result = await productService.deleteProduct(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: "something went wrong while deleting product" });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const result = await productService.getProduct(req.params.id);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: "no record found" });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const result = await productService.updateProduct(req.params.id, req.body);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: "Failed to update product" });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const result = await productService.searchProducts(req.params.key);
        res.send(result);
    } catch (err) {
        res.status(500).send({ error: "Failed to search products" });
    }
};

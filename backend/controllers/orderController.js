/**
 * orderController.js
 * Handles order-related operations: create, retrieve, update status.
 * Implements role-based access: users see their orders, admins see all.
 */

const log = (...args) => console.log('[OrderController]', ...args);

import { validationResult } from 'express-validator';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { handleControllerError } from '../utils/errorHandler.js';

/**
 * Create a new order
 * Users can place orders for products
 * @route POST /api/v1/orders
 */
export const createOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            log('Order validation failed:', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        const { items, shippingAddress, paymentMethod, notes } = req.body;
        const userId = req.user.userId;

        // Validate and calculate total
        let totalAmount = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ 
                    error: `Product not found: ${item.productId}` 
                });
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                productId: product._id,
                name: product.name,
                quantity: item.quantity,
                price: product.price
            });
        }

        const order = new Order({
            userId,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod: paymentMethod || 'cod',
            notes
        });

        await order.save();
        log('Order created:', order._id, 'by user:', req.user.email);
        
        res.status(201).json({ 
            success: true,
            order 
        });
    } catch (error) {
        log('Create order error:', error.message);
        handleControllerError(res, error, 'Failed to create order');
    }
};

/**
 * Get orders
 * Users see their own orders, admins see all orders
 * @route GET /api/v1/orders
 */
export const getOrders = async (req, res) => {
    try {
        const userId = req.user.userId;
        const isAdmin = req.user.role === 'admin';

        // Build query based on role
        const query = isAdmin ? {} : { userId };

        const orders = await Order.find(query)
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        log(`Retrieved ${orders.length} orders for ${isAdmin ? 'admin' : 'user'}:`, req.user.email);
        
        res.json({ orders });
    } catch (error) {
        log('Get orders error:', error.message);
        handleControllerError(res, error, 'Failed to retrieve orders');
    }
};

/**
 * Get single order by ID
 * Users can only see their own orders, admins can see any order
 * @route GET /api/v1/orders/:id
 */
export const getOrderById = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const userId = req.user.userId;
        const isAdmin = req.user.role === 'admin';

        const order = await Order.findById(id)
            .populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check authorization: user can only see their own orders
        if (!isAdmin && order.userId._id.toString() !== userId) {
            log('Unauthorized order access attempt by:', req.user.email);
            return res.status(403).json({ error: 'Forbidden - Not your order' });
        }

        res.json({ order });
    } catch (error) {
        log('Get order error:', error.message);
        handleControllerError(res, error, 'Failed to retrieve order');
    }
};

/**
 * Update order status (Admin only)
 * @route PATCH /api/v1/orders/:id/status
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        order.status = status;
        await order.save();

        log('Order status updated:', id, 'to', status, 'by admin:', req.user.email);
        
        res.json({ 
            success: true, 
            order 
        });
    } catch (error) {
        log('Update order status error:', error.message);
        handleControllerError(res, error, 'Failed to update order status');
    }
};

/**
 * Cancel order (User can cancel their own pending orders)
 * @route PATCH /api/v1/orders/:id/cancel
 */
export const cancelOrder = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const userId = req.user.userId;
        const isAdmin = req.user.role === 'admin';

        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Check authorization
        if (!isAdmin && order.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Forbidden - Not your order' });
        }

        // Only pending or confirmed orders can be cancelled
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({ 
                error: `Cannot cancel order with status: ${order.status}` 
            });
        }

        order.status = 'cancelled';
        await order.save();

        log('Order cancelled:', id, 'by:', req.user.email);
        
        res.json({ 
            success: true, 
            order 
        });
    } catch (error) {
        log('Cancel order error:', error.message);
        handleControllerError(res, error, 'Failed to cancel order');
    }
};

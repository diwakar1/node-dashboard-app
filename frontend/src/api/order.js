/**
 * order.js
 * API helper functions for order operations
 */
import { apiRequest } from './auth';
import { ORDER_ENDPOINTS } from '../constants/apiEndpoints';

/**
 * Create a new order
 * @param {Object} orderData - Order details {items, shippingAddress, paymentMethod, notes}
 * @returns {Promise<Object>} Created order
 */
export const createOrder = async (orderData) => {
  return await apiRequest(ORDER_ENDPOINTS.CREATE, {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

/**
 * Get all orders (users see their own, admins see all)
 * @returns {Promise<Array>} List of orders
 */
export const getOrders = async () => {
  return await apiRequest(ORDER_ENDPOINTS.GET_ALL);
};

/**
 * Get a single order by ID
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  return await apiRequest(ORDER_ENDPOINTS.GET_BY_ID(orderId));
};

/**
 * Update order status (Admin only)
 * @param {string} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status) => {
  return await apiRequest(ORDER_ENDPOINTS.UPDATE_STATUS(orderId), {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
};

/**
 * Cancel an order
 * @param {string} orderId - Order ID
 * @returns {Promise<Object>} Cancelled order
 */
export const cancelOrder = async (orderId) => {
  return await apiRequest(ORDER_ENDPOINTS.CANCEL(orderId), {
    method: 'PATCH',
  });
};

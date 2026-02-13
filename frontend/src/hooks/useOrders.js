/**
 * useOrders.js
 * Custom hook for managing orders
 */
import { useState } from 'react';
import * as orderApi from '../api/order';

export const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all orders
   */
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.getOrders();
      if (response.orders) {
        setOrders(response.orders);
        return { success: true, orders: response.orders };
      } else {
        setError(response.error || 'Failed to fetch orders');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError('Network error');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get single order by ID
   */
  const fetchOrderById = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.getOrderById(orderId);
      if (response.order) {
        return { success: true, order: response.order };
      } else {
        setError(response.error || 'Failed to fetch order');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError('Network error');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new order
   */
  const placeOrder = async (orderData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.createOrder(orderData);
      if (response.success) {
        return { success: true, order: response.order };
      } else {
        setError(response.error || 'Failed to create order');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError('Network error');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update order status (Admin only)
   */
  const updateStatus = async (orderId, status) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.updateOrderStatus(orderId, status);
      if (response.success) {
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status } : order
          )
        );
        return { success: true, order: response.order };
      } else {
        setError(response.error || 'Failed to update order status');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError('Network error');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Cancel order
   */
  const cancelOrder = async (orderId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.cancelOrder(orderId);
      if (response.success) {
        // Update local state
        setOrders(prevOrders =>
          prevOrders.map(order =>
            order._id === orderId ? { ...order, status: 'cancelled' } : order
          )
        );
        return { success: true, order: response.order };
      } else {
        setError(response.error || 'Failed to cancel order');
        return { success: false, error: response.error };
      }
    } catch (err) {
      setError('Network error');
      return { success: false, error: 'Network error' };
    } finally {
      setLoading(false);
    }
  };

  return {
    orders,
    loading,
    error,
    fetchOrders,
    fetchOrderById,
    placeOrder,
    updateStatus,
    cancelOrder,
  };
};

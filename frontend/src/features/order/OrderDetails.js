/**
 * OrderDetails.js
 * Detailed view of a single order
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import './Order.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { fetchOrderById, cancelOrder, updateStatus } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    setLoading(true);
    const result = await fetchOrderById(id);
    if (result.success) {
      setOrder(result.order);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    const result = await cancelOrder(id);
    if (result.success) {
      alert('Order cancelled successfully');
      navigate('/orders');
    } else {
      alert(`Failed to cancel order: ${result.error}`);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    const result = await updateStatus(id, newStatus);
    if (result.success) {
      setOrder(prev => ({ ...prev, status: newStatus }));
      alert('Order status updated successfully');
    } else {
      alert(`Failed to update status: ${result.error}`);
    }
  };

  if (loading) {
    return <div className="container"><p>Loading order details...</p></div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-message">{error}</div>
        <button onClick={() => navigate('/orders')} className="appButton">
          Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return <div className="container"><p>Order not found</p></div>;
  }

  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div className="container">
      <div className="order-details-page">
        <div className="order-details-header">
          <button onClick={() => navigate('/orders')} className="back-button">
            ← Back to Orders
          </button>
          <h2>Order Details</h2>
        </div>

        <div className="order-info-card">
          <div className="order-info-section">
            <h3>Order Information</h3>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Status:</strong> <span className={`status-${order.status}`}>{order.status.toUpperCase()}</span></p>
            <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod.toUpperCase()}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            {order.notes && <p><strong>Notes:</strong> {order.notes}</p>}
          </div>

          {isAdmin() && order.userId && (
            <div className="order-info-section">
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> {order.userId.name}</p>
              <p><strong>Email:</strong> {order.userId.email}</p>
            </div>
          )}

          <div className="order-info-section">
            <h3>Shipping Address</h3>
            <p>{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="order-info-section">
            <h3>Order Items</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3"><strong>Total</strong></td>
                  <td><strong>${order.totalAmount.toFixed(2)}</strong></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="order-actions-section">
          {!isAdmin() && canCancel && (
            <button onClick={handleCancelOrder} className="cancel-button">
              Cancel Order
            </button>
          )}

          {isAdmin() && order.status !== 'cancelled' && order.status !== 'delivered' && (
            <div className="admin-actions">
              <h3>Update Order Status</h3>
              <div className="status-buttons">
                {order.status !== 'confirmed' && (
                  <button onClick={() => handleStatusUpdate('confirmed')} className="appButton">
                    Mark as Confirmed
                  </button>
                )}
                {order.status !== 'shipped' && order.status !== 'pending' && (
                  <button onClick={() => handleStatusUpdate('shipped')} className="appButton">
                    Mark as Shipped
                  </button>
                )}
                {order.status !== 'delivered' && order.status === 'shipped' && (
                  <button onClick={() => handleStatusUpdate('delivered')} className="appButton">
                    Mark as Delivered
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;

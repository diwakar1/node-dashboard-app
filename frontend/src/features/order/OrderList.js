/**
 * OrderList.js
 * Displays list of orders
 * - Users see their own orders
 * - Admins see all orders with ability to update status
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import './Order.css';

const OrderList = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { orders, loading, error, fetchOrders, updateStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    const result = await updateStatus(orderId, newStatus);
    if (result.success) {
      alert('Order status updated successfully');
    } else {
      alert(`Failed to update status: ${result.error}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#FFA500',
      confirmed: '#4169E1',
      shipped: '#9370DB',
      delivered: '#32CD32',
      cancelled: '#DC143C'
    };
    return colors[status] || '#666';
  };

  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  if (loading && orders.length === 0) {
    return <div className="container"><p>Loading orders...</p></div>;
  }

  return (
    <div className="container">
      <div className="order-list">
        <div className="order-header">
          <h2>{isAdmin() ? 'All Orders' : 'My Orders'}</h2>
          
          <div className="order-filters">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-filter"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {error && <div className="error-message">{error}</div>}

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <p>No orders found.</p>
            <button onClick={() => navigate('/products')} className="appButton">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div>
                    <h3>Order #{order._id.slice(-8)}</h3>
                    {isAdmin() && order.userId && (
                      <p className="order-customer">
                        Customer: {order.userId.name} ({order.userId.email})
                      </p>
                    )}
                  </div>
                  <span 
                    className="order-status-badge"
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>

                <div className="order-items">
                  <h4>Items ({order.items.length})</h4>
                  {order.items.map((item, index) => (
                    <div key={index} className="order-item">
                      <span>{item.name}</span>
                      <span>Qty: {item.quantity}</span>
                      <span>${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="order-details">
                  <div className="order-total">
                    <strong>Total:</strong>
                    <strong>${order.totalAmount.toFixed(2)}</strong>
                  </div>
                  
                  <div className="order-shipping">
                    <strong>Shipping Address:</strong>
                    <p>
                      {order.shippingAddress.fullName}<br />
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      Phone: {order.shippingAddress.phone}
                    </p>
                  </div>

                  <div className="order-meta">
                    <small>Payment: {order.paymentMethod.toUpperCase()}</small>
                    <small>Placed: {new Date(order.createdAt).toLocaleDateString()}</small>
                  </div>
                </div>

                <div className="order-actions">
                  <button 
                    onClick={() => navigate(`/orders/${order._id}`)}
                    className="appButton view-button"
                  >
                    View Details
                  </button>

                  {isAdmin() && order.status !== 'cancelled' && order.status !== 'delivered' && (
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="status-update-select"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;

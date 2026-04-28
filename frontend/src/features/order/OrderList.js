/**
 * OrderList.js
 * Displays list of orders
 * - Users see their own orders with a status timeline
 * - Admins see all orders with ability to update status
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import './Order.css';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_META = {
  pending:   { label: 'Pending',   icon: 'fa-clock',            color: '#FFA500' },
  confirmed: { label: 'Confirmed', icon: 'fa-circle-check',     color: '#4169E1' },
  shipped:   { label: 'Shipped',   icon: 'fa-truck',            color: '#9370DB' },
  delivered: { label: 'Delivered', icon: 'fa-box-open',         color: '#28a745' },
  cancelled: { label: 'Cancelled', icon: 'fa-circle-xmark',     color: '#DC143C' },
};

const NEXT_STATUS = {
  pending:   'confirmed',
  confirmed: 'shipped',
  shipped:   'delivered',
};

const OrderList = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { orders, loading, error, fetchOrders, updateStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState({}); // { [orderId]: { type, msg } }

  useEffect(() => {
    fetchOrders();
  }, []);

  const showFeedback = (orderId, type, msg) => {
    setFeedback(prev => ({ ...prev, [orderId]: { type, msg } }));
    setTimeout(() => setFeedback(prev => {
      const next = { ...prev };
      delete next[orderId];
      return next;
    }), 3000);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    const result = await updateStatus(orderId, newStatus);
    if (result.success) {
      showFeedback(orderId, 'success', `Status updated to ${STATUS_META[newStatus].label}`);
    } else {
      showFeedback(orderId, 'error', result.error || 'Failed to update status');
    }
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
              {Object.entries(STATUS_META).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
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
            {filteredOrders.map((order) => {
              const meta = STATUS_META[order.status] || STATUS_META.pending;
              const isCancelled = order.status === 'cancelled';
              const activeStep = isCancelled ? -1 : STATUS_STEPS.indexOf(order.status);

              return (
                <div key={order._id} className="order-card">
                  {/* Header */}
                  <div className="order-card-header">
                    <div>
                      <h3>Order #{order._id.slice(-8).toUpperCase()}</h3>
                      <small className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </small>
                      {isAdmin() && order.userId && (
                        <p className="order-customer">
                          <i className="fa-solid fa-user"></i> {order.userId.name} ({order.userId.email})
                        </p>
                      )}
                    </div>
                    <span className="order-status-badge" style={{ backgroundColor: meta.color }}>
                      <i className={`fa-solid ${meta.icon}`}></i> {meta.label}
                    </span>
                  </div>

                  {/* Status Timeline */}
                  {!isCancelled ? (
                    <div className="status-timeline">
                      {STATUS_STEPS.map((step, idx) => {
                        const done = idx <= activeStep;
                        const current = idx === activeStep;
                        return (
                          <React.Fragment key={step}>
                            <div className={`timeline-step ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
                              <div className="timeline-dot" style={{ backgroundColor: done ? STATUS_META[step].color : '#ddd' }}>
                                <i className={`fa-solid ${STATUS_META[step].icon}`}></i>
                              </div>
                              <span className="timeline-label">{STATUS_META[step].label}</span>
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                              <div className={`timeline-line ${idx < activeStep ? 'done' : ''}`}></div>
                            )}
                          </React.Fragment>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="cancelled-banner">
                      <i className="fa-solid fa-circle-xmark"></i> This order was cancelled
                    </div>
                  )}

                  {/* Items */}
                  <div className="order-items">
                    <h4>Items ({order.items.length})</h4>
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <span>{item.name}</span>
                        <span>×{item.quantity}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Total + Payment */}
                  <div className="order-total">
                    <strong>Total</strong>
                    <strong>${order.totalAmount.toFixed(2)}</strong>
                  </div>
                  <div className="order-meta">
                    <small><i className="fa-solid fa-credit-card"></i> {order.paymentMethod.toUpperCase()}</small>
                    <small><i className="fa-solid fa-location-dot"></i> {order.shippingAddress.city}, {order.shippingAddress.state}</small>
                  </div>

                  {/* Inline feedback */}
                  {feedback[order._id] && (
                    <div className={`order-feedback ${feedback[order._id].type}`}>
                      <i className={`fa-solid ${feedback[order._id].type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                      {' '}{feedback[order._id].msg}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="order-actions">
                    <button
                      onClick={() => navigate(`/orders/${order._id}`)}
                      className="appButton view-button"
                    >
                      <i className="fa-solid fa-eye"></i> Details
                    </button>

                    {isAdmin() && !isCancelled && order.status !== 'delivered' && (
                      <>
                        {NEXT_STATUS[order.status] && (
                          <button
                            className="status-next-btn"
                            onClick={() => handleStatusUpdate(order._id, NEXT_STATUS[order.status])}
                          >
                            <i className="fa-solid fa-arrow-right"></i> Mark {STATUS_META[NEXT_STATUS[order.status]].label}
                          </button>
                        )}
                        <button
                          className="status-cancel-btn"
                          onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                        >
                          <i className="fa-solid fa-ban"></i> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderList;

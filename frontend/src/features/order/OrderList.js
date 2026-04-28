/**
 * OrderList.js
 * Displays list of orders — Amazon-style full-width layout
 * - Users see their own orders with a status tracker
 * - Admins see all orders with ability to update status inline
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import './Order.css';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_META = {
  pending:   { label: 'Pending',   icon: 'fa-clock',          color: '#FFA500' },
  confirmed: { label: 'Confirmed', icon: 'fa-circle-check',   color: '#4169E1' },
  shipped:   { label: 'Shipped',   icon: 'fa-truck',          color: '#9370DB' },
  delivered: { label: 'Delivered', icon: 'fa-box-open',       color: '#28a745' },
  cancelled: { label: 'Cancelled', icon: 'fa-circle-xmark',   color: '#DC143C' },
};

const NEXT_STATUS = {
  pending:   'confirmed',
  confirmed: 'shipped',
  shipped:   'delivered',
};

const FILTER_TABS = [
  { value: 'all',       label: 'All Orders' },
  { value: 'pending',   label: 'Pending'    },
  { value: 'confirmed', label: 'Confirmed'  },
  { value: 'shipped',   label: 'Shipped'    },
  { value: 'delivered', label: 'Delivered'  },
  { value: 'cancelled', label: 'Cancelled'  },
];

const OrderList = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { orders, loading, error, fetchOrders, updateStatus } = useOrders();
  const [statusFilter, setStatusFilter] = useState('all');
  const [feedback, setFeedback] = useState({});

  useEffect(() => { fetchOrders(); }, []);

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
      showFeedback(orderId, 'success', `Marked as ${STATUS_META[newStatus].label}`);
    } else {
      showFeedback(orderId, 'error', result.error || 'Failed to update status');
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  if (loading && orders.length === 0) {
    return (
      <div className="ol-loading">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading orders…
      </div>
    );
  }

  return (
    <div className="ol-page">

      {/* ── Page header ── */}
      <div className="ol-page-header">
        <h1 className="ol-page-title">
          {isAdmin() ? 'All Orders' : 'Your Orders'}
        </h1>
        {orders.length > 0 && (
          <span className="ol-count">{filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}</span>
        )}
      </div>

      {/* ── Filter tabs ── */}
      <div className="ol-filter-bar">
        {FILTER_TABS.map(tab => (
          <button
            key={tab.value}
            className={`ol-filter-tab ${statusFilter === tab.value ? 'active' : ''}`}
            onClick={() => setStatusFilter(tab.value)}
          >
            {tab.label}
            {tab.value !== 'all' && (
              <span className="ol-tab-count">
                {orders.filter(o => o.status === tab.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {error && (
        <div className="ol-error">
          <i className="fa-solid fa-triangle-exclamation"></i> {error}
        </div>
      )}

      {/* ── Empty state ── */}
      {filteredOrders.length === 0 ? (
        <div className="ol-empty">
          <i className="fa-solid fa-box-open"></i>
          <p>{statusFilter === 'all' ? "You haven't placed any orders yet." : `No ${statusFilter} orders.`}</p>
          <button onClick={() => navigate('/products')} className="ol-shop-btn">
            <i className="fa-solid fa-bag-shopping"></i> Browse Products
          </button>
        </div>
      ) : (
        <div className="ol-list">
          {filteredOrders.map((order) => {
            const meta        = STATUS_META[order.status] || STATUS_META.pending;
            const isCancelled = order.status === 'cancelled';
            const activeStep  = isCancelled ? -1 : STATUS_STEPS.indexOf(order.status);
            const fb          = feedback[order._id];

            return (
              <div key={order._id} className="ol-card">

                {/* ── Card header bar ── */}
                <div className="ol-card-head">
                  <div className="ol-head-meta">
                    <div className="ol-head-cell">
                      <span className="ol-head-label">ORDER PLACED</span>
                      <span className="ol-head-value">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="ol-head-cell">
                      <span className="ol-head-label">TOTAL</span>
                      <span className="ol-head-value">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="ol-head-cell">
                      <span className="ol-head-label">PAYMENT</span>
                      <span className="ol-head-value">{order.paymentMethod.toUpperCase()}</span>
                    </div>
                    {isAdmin() && order.userId && (
                      <div className="ol-head-cell">
                        <span className="ol-head-label">CUSTOMER</span>
                        <span className="ol-head-value">{order.userId.name}</span>
                      </div>
                    )}
                  </div>
                  <div className="ol-head-id">
                    <span className="ol-head-label">ORDER # {order._id.slice(-8).toUpperCase()}</span>
                    <button
                      className="ol-details-link"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      View order details <i className="fa-solid fa-arrow-right"></i>
                    </button>
                  </div>
                </div>

                {/* ── Card body ── */}
                <div className="ol-card-body">

                  {/* Left: status + items */}
                  <div className="ol-card-main">

                    {/* Status */}
                    <div className="ol-status-row">
                      <span className="ol-status-badge" style={{ color: meta.color }}>
                        <i className={`fa-solid ${meta.icon}`}></i> {meta.label}
                      </span>
                      {!isCancelled && (
                        <div className="ol-mini-timeline">
                          {STATUS_STEPS.map((step, idx) => {
                            const done    = idx <= activeStep;
                            const current = idx === activeStep;
                            return (
                              <React.Fragment key={step}>
                                <div
                                  className={`ol-mt-dot ${done ? 'done' : ''} ${current ? 'current' : ''}`}
                                  title={STATUS_META[step].label}
                                  style={{ backgroundColor: done ? STATUS_META[step].color : '#e0e0e0' }}
                                >
                                  <i className={`fa-solid ${STATUS_META[step].icon}`}
                                     style={{ color: done ? '#fff' : '#bbb', fontSize: '10px' }}></i>
                                </div>
                                {idx < STATUS_STEPS.length - 1 && (
                                  <div className={`ol-mt-line ${idx < activeStep ? 'done' : ''}`}></div>
                                )}
                              </React.Fragment>
                            );
                          })}
                        </div>
                      )}
                      {isCancelled && (
                        <span className="ol-cancelled-note">
                          <i className="fa-solid fa-circle-xmark"></i> This order was cancelled
                        </span>
                      )}
                    </div>

                    {/* Items */}
                    <div className="ol-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="ol-item-row">
                          <div className="ol-item-icon">
                            <i className="fa-solid fa-cube"></i>
                          </div>
                          <div className="ol-item-info">
                            <span className="ol-item-name">{item.name}</span>
                            <span className="ol-item-qty">Qty: {item.quantity}</span>
                          </div>
                          <span className="ol-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping city shorthand */}
                    <div className="ol-ship-note">
                      <i className="fa-solid fa-location-dot"></i>
                      {' '}Ship to: {order.shippingAddress.fullName} — {order.shippingAddress.city}, {order.shippingAddress.state}
                    </div>

                    {/* Inline feedback */}
                    {fb && (
                      <div className={`ol-feedback ol-feedback-${fb.type}`}>
                        <i className={`fa-solid ${fb.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
                        {' '}{fb.msg}
                      </div>
                    )}
                  </div>

                  {/* Right: action buttons */}
                  <div className="ol-card-actions">
                    <button
                      className="ol-btn-primary"
                      onClick={() => navigate(`/orders/${order._id}`)}
                    >
                      View Details
                    </button>

                    {isAdmin() && !isCancelled && order.status !== 'delivered' && (
                      <>
                        {NEXT_STATUS[order.status] && (
                          <button
                            className="ol-btn-secondary"
                            onClick={() => handleStatusUpdate(order._id, NEXT_STATUS[order.status])}
                          >
                            <i className="fa-solid fa-arrow-right"></i>
                            {' '}Mark {STATUS_META[NEXT_STATUS[order.status]].label}
                          </button>
                        )}
                        <button
                          className="ol-btn-danger"
                          onClick={() => handleStatusUpdate(order._id, 'cancelled')}
                        >
                          <i className="fa-solid fa-ban"></i> Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderList;

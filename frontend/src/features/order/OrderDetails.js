/**
 * OrderDetails.js
 * Detailed view of a single order — Amazon-style layout
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../context/AuthContext';
import './Order.css';

const STATUS_STEPS = ['pending', 'confirmed', 'shipped', 'delivered'];

const STATUS_META = {
  pending:   { label: 'Pending',   icon: 'fa-clock',         color: '#FFA500' },
  confirmed: { label: 'Confirmed', icon: 'fa-circle-check',  color: '#4169E1' },
  shipped:   { label: 'Shipped',   icon: 'fa-truck',         color: '#9370DB' },
  delivered: { label: 'Delivered', icon: 'fa-box-open',      color: '#28a745' },
  cancelled: { label: 'Cancelled', icon: 'fa-circle-xmark',  color: '#DC143C' },
};

const NEXT_STATUS = {
  pending:   'confirmed',
  confirmed: 'shipped',
  shipped:   'delivered',
};

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { fetchOrderById, cancelOrder, updateStatus } = useOrders();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null);

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

  const showFeedback = (type, msg) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    const result = await cancelOrder(id);
    if (result.success) {
      setOrder(prev => ({ ...prev, status: 'cancelled' }));
      showFeedback('success', 'Order cancelled successfully.');
    } else {
      showFeedback('error', result.error || 'Failed to cancel order.');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    const result = await updateStatus(id, newStatus);
    if (result.success) {
      setOrder(prev => ({ ...prev, status: newStatus }));
      showFeedback('success', `Status updated to ${STATUS_META[newStatus].label}.`);
    } else {
      showFeedback('error', result.error || 'Failed to update status.');
    }
  };

  if (loading) {
    return (
      <div className="od-loading">
        <i className="fa-solid fa-spinner fa-spin"></i> Loading order details…
      </div>
    );
  }

  if (error) {
    return (
      <div className="od-error-page">
        <i className="fa-solid fa-triangle-exclamation"></i>
        <p>{error}</p>
        <button onClick={() => navigate('/orders')} className="od-back-link">
          ← Back to Orders
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="od-error-page">
        <p>Order not found.</p>
        <button onClick={() => navigate('/orders')} className="od-back-link">← Back to Orders</button>
      </div>
    );
  }

  const isCancelled = order.status === 'cancelled';
  const activeStep  = isCancelled ? -1 : STATUS_STEPS.indexOf(order.status);
  const meta        = STATUS_META[order.status] || STATUS_META.pending;
  const canCancel   = !isAdmin() && ['pending', 'confirmed'].includes(order.status);
  const nextStatus  = NEXT_STATUS[order.status];

  const itemsSubtotal = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="od-page">

      {/* ── Breadcrumb / Back ── */}
      <div className="od-breadcrumb">
        <button onClick={() => navigate('/orders')} className="od-back-link">
          <i className="fa-solid fa-arrow-left"></i> Back to Orders
        </button>
        <span className="od-breadcrumb-sep">/</span>
        <span>Order #{order._id.slice(-8).toUpperCase()}</span>
      </div>

      {/* ── Page Header ── */}
      <div className="od-page-header">
        <div>
          <h1 className="od-page-title">Order Details</h1>
          <p className="od-page-sub">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <div className="od-header-badge" style={{ backgroundColor: meta.color }}>
          <i className={`fa-solid ${meta.icon}`}></i> {meta.label}
        </div>
      </div>

      {/* ── Inline Feedback ── */}
      {feedback && (
        <div className={`od-feedback od-feedback-${feedback.type}`}>
          <i className={`fa-solid ${feedback.type === 'success' ? 'fa-circle-check' : 'fa-triangle-exclamation'}`}></i>
          {' '}{feedback.msg}
        </div>
      )}

      {/* ── Status Progress Bar ── */}
      <div className="od-status-card">
        {isCancelled ? (
          <div className="od-cancelled-banner">
            <i className="fa-solid fa-circle-xmark"></i>
            <div>
              <strong>Order Cancelled</strong>
              <p>This order has been cancelled and will not be shipped.</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="od-section-title">
              <i className="fa-solid fa-route"></i> Order Status
            </h2>
            <div className="od-timeline">
              {STATUS_STEPS.map((step, idx) => {
                const done    = idx <= activeStep;
                const current = idx === activeStep;
                const sm      = STATUS_META[step];
                return (
                  <React.Fragment key={step}>
                    <div className={`od-tstep ${done ? 'done' : ''} ${current ? 'current' : ''}`}>
                      <div
                        className="od-tdot"
                        style={{ backgroundColor: done ? sm.color : '#e0e0e0', color: done ? '#fff' : '#aaa' }}
                      >
                        <i className={`fa-solid ${sm.icon}`}></i>
                      </div>
                      <span className="od-tlabel">{sm.label}</span>
                    </div>
                    {idx < STATUS_STEPS.length - 1 && (
                      <div className={`od-tline ${idx < activeStep ? 'done' : ''}`}></div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Main Body: 2 columns ── */}
      <div className="od-body">

        {/* Left column */}
        <div className="od-left">

          {/* Shipping Address */}
          <div className="od-card">
            <h2 className="od-section-title">
              <i className="fa-solid fa-location-dot"></i> Shipping Address
            </h2>
            <div className="od-address-block">
              <p className="od-address-name">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p className="od-address-phone">
                <i className="fa-solid fa-phone"></i> {order.shippingAddress.phone}
              </p>
            </div>
          </div>

          {/* Payment Method */}
          <div className="od-card">
            <h2 className="od-section-title">
              <i className="fa-solid fa-credit-card"></i> Payment Method
            </h2>
            <p className="od-payment-method">
              <i className="fa-solid fa-wallet"></i>
              {' '}{order.paymentMethod.toUpperCase()}
            </p>
            {order.notes && (
              <p className="od-notes">
                <i className="fa-solid fa-note-sticky"></i> {order.notes}
              </p>
            )}
          </div>

          {/* Customer Info (admin only) */}
          {isAdmin() && order.userId && (
            <div className="od-card">
              <h2 className="od-section-title">
                <i className="fa-solid fa-user"></i> Customer
              </h2>
              <p className="od-customer-name">{order.userId.name}</p>
              <p className="od-customer-email">
                <i className="fa-solid fa-envelope"></i> {order.userId.email}
              </p>
            </div>
          )}

          {/* Order Items */}
          <div className="od-card">
            <h2 className="od-section-title">
              <i className="fa-solid fa-box"></i> Items Ordered
              <span className="od-item-count">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
            </h2>
            <div className="od-items-list">
              {order.items.map((item, index) => (
                <div key={index} className="od-item-row">
                  <div className="od-item-icon">
                    <i className="fa-solid fa-cube"></i>
                  </div>
                  <div className="od-item-info">
                    <p className="od-item-name">{item.name}</p>
                    <p className="od-item-qty">Qty: {item.quantity}</p>
                  </div>
                  <div className="od-item-prices">
                    <p className="od-item-unit">${item.price.toFixed(2)} each</p>
                    <p className="od-item-subtotal">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right column — Order Summary */}
        <div className="od-right">
          <div className="od-summary-card">
            <h2 className="od-section-title">
              <i className="fa-solid fa-receipt"></i> Order Summary
            </h2>
            <div className="od-summary-id">
              <span>Order #</span>
              <span className="od-id-mono">{order._id.slice(-8).toUpperCase()}</span>
            </div>
            <div className="od-summary-rows">
              <div className="od-summary-row">
                <span>Items ({order.items.length})</span>
                <span>${itemsSubtotal.toFixed(2)}</span>
              </div>
              <div className="od-summary-row">
                <span>Shipping</span>
                <span className="od-free-tag">FREE</span>
              </div>
              <div className="od-summary-row od-summary-total">
                <span>Order Total</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="od-summary-actions">
              {canCancel && (
                <button onClick={handleCancelOrder} className="od-btn-cancel">
                  <i className="fa-solid fa-ban"></i> Cancel Order
                </button>
              )}

              {isAdmin() && !isCancelled && order.status !== 'delivered' && nextStatus && (
                <button
                  onClick={() => handleStatusUpdate(nextStatus)}
                  className="od-btn-advance"
                >
                  <i className="fa-solid fa-arrow-right"></i>
                  {' '}Mark as {STATUS_META[nextStatus].label}
                </button>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderDetails;

/**
 * Checkout.js
 * Checkout page for placing orders with items from cart
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../hooks/useOrders';
import { useForm } from '../../hooks/useForm';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { placeOrder, loading: orderLoading } = useOrders();

  // Credit card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardErrors, setCardErrors] = useState({});

  // Success modal state
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Error banner state
  const [orderError, setOrderError] = useState('');

  const { values, errors, handleChange, handleBlur, validate } = useForm({
    initialValues: {
      fullName: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      paymentMethod: 'cod',
      notes: ''
    },
    validationRules: {
      fullName: { required: { value: true, message: 'Full name is required' } },
      address: { required: { value: true, message: 'Address is required' } },
      city: { required: { value: true, message: 'City is required' } },
      state: { required: { value: true, message: 'State is required' } },
      zipCode: {
        required: { value: true, message: 'Zip code is required' },
        pattern: { value: /^\d{5,6}$/, message: 'Invalid zip code (5-6 digits)' }
      },
      phone: {
        required: { value: true, message: 'Phone is required' },
        pattern: { value: /^\d{10}$/, message: 'Phone must be 10 digits' }
      }
    }
  });

  // US States list
  const US_STATES = [
    'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
    'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
    'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
    'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire',
    'New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio',
    'Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota',
    'Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia',
    'Wisconsin','Wyoming'
  ];

  useEffect(() => {
    if (cartItems.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [cartItems, navigate, orderSuccess]);

  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(raw.replace(/(.{4})/g, '$1 ').trim());
  };

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) raw = raw.slice(0, 2) + '/' + raw.slice(2);
    setCardExpiry(raw);
  };

  const handleCvvChange = (e) => {
    setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  const validateCard = () => {
    const errs = {};
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      errs.cardNumber = 'Card number must be 16 digits';
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      errs.cardExpiry = 'Expiry must be MM/YY';
    }
    if (cardCvv.length < 3) {
      errs.cardCvv = 'CVV must be 3-4 digits';
    }
    setCardErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = async () => {
    setOrderError('');
    if (!validate()) return;
    if (values.paymentMethod === 'card' && !validateCard()) return;

    const orderData = {
      items: cartItems.map(item => ({
        productId: item._id,
        quantity: item.quantity
      })),
      shippingAddress: {
        fullName: values.fullName,
        address: values.address,
        city: values.city,
        state: values.state,
        zipCode: values.zipCode,
        phone: values.phone
      },
      paymentMethod: values.paymentMethod,
      notes: values.notes
    };

    const result = await placeOrder(orderData);
    if (result.success) {
      clearCart();
      setOrderSuccess(result.order);
    } else {
      setOrderError(result.error || 'Failed to place order. Please try again.');
    }
  };

  if (cartItems.length === 0 && !orderSuccess) {
    return null;
  }

  const totalAmount = orderSuccess ? orderSuccess.totalAmount : getCartTotal();

  const PAYMENT_OPTIONS = [
    { value: 'cod',  icon: '💵', label: 'Cash on Delivery',      desc: 'Pay when your order arrives' },
    { value: 'card', icon: '💳', label: 'Credit / Debit Card',   desc: 'Visa, Mastercard, Amex' },
    { value: 'upi',  icon: '📱', label: 'UPI',                   desc: 'GPay, PhonePe, Paytm' },
  ];

  const paymentLabel = (method) => {
    const opt = PAYMENT_OPTIONS.find(o => o.value === method);
    return opt ? opt.label : method;
  };

  return (
    <div className="checkout-page">

      {/* ── Order Success Modal ── */}
      {orderSuccess && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <div className="order-modal-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>Order Placed!</h2>
            <p className="order-modal-sub">
              Thank you for your purchase. We'll get it ready for you soon.
            </p>
            <div className="order-modal-details">
              <div className="order-modal-row">
                <span>Order ID</span>
                <span className="order-modal-value">#{orderSuccess._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="order-modal-row">
                <span>Payment</span>
                <span className="order-modal-value">{paymentLabel(orderSuccess.paymentMethod)}</span>
              </div>
              <div className="order-modal-row">
                <span>Items</span>
                <span className="order-modal-value">{orderSuccess.items.length}</span>
              </div>
              <div className="order-modal-row order-modal-total">
                <span>Order Total</span>
                <span>${orderSuccess.totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <button className="appButton order-modal-btn" onClick={() => navigate('/orders')}>
              <i className="fa-solid fa-bag-shopping"></i> View My Orders
            </button>
            <button className="continue-link" onClick={() => navigate('/products')}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <div className="checkout-page__inner">
        {/* ── Breadcrumb steps ── */}
        <div className="checkout-steps">
          <span className="checkout-steps__step" onClick={() => navigate('/cart')} style={{ cursor: 'pointer' }}>Cart</span>
          <span className="checkout-steps__sep">›</span>
          <span className="checkout-steps__step checkout-steps__step--active">Checkout</span>
          <span className="checkout-steps__sep">›</span>
          <span className="checkout-steps__step">Order Confirmed</span>
        </div>

        <h1 className="checkout-page__title">Checkout</h1>

        {orderError && (
          <div className="order-error-banner">
            <i className="fa-solid fa-triangle-exclamation"></i> {orderError}
          </div>
        )}

        <div className="checkout-layout">
          {/* ── Left column ── */}
          <div>

            {/* Step 1 – Shipping Address */}
            <div className="co-card">
              <div className="co-card__header">
                <span className="co-card__step-num">1</span>
                <h2 className="co-card__title">Shipping Address</h2>
              </div>

              <div className="address-grid">
                <div className="field-group full-width">
                  <label className="field-label">Full Name</label>
                  <input
                    type="text"
                    className="inputBox"
                    placeholder="John Doe"
                    name="fullName"
                    value={values.fullName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.fullName && <span className="error">{errors.fullName}</span>}
                </div>

                <div className="field-group full-width">
                  <label className="field-label">Street Address</label>
                  <input
                    type="text"
                    className="inputBox"
                    placeholder="123 Main St, Apt 4B"
                    name="address"
                    value={values.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.address && <span className="error">{errors.address}</span>}
                </div>

                <div className="field-group">
                  <label className="field-label">City</label>
                  <input
                    type="text"
                    className="inputBox"
                    placeholder="New York"
                    name="city"
                    value={values.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.city && <span className="error">{errors.city}</span>}
                </div>

                <div className="field-group">
                  <label className="field-label">State</label>
                  <select
                    className="inputBox"
                    name="state"
                    value={values.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select State</option>
                    {US_STATES.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <span className="error">{errors.state}</span>}
                </div>

                <div className="field-group">
                  <label className="field-label">Zip Code</label>
                  <input
                    type="text"
                    className="inputBox"
                    placeholder="10001"
                    name="zipCode"
                    value={values.zipCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.zipCode && <span className="error">{errors.zipCode}</span>}
                </div>

                <div className="field-group">
                  <label className="field-label">Phone Number</label>
                  <input
                    type="text"
                    className="inputBox"
                    placeholder="10-digit number"
                    name="phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.phone && <span className="error">{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Step 2 – Payment Method */}
            <div className="co-card">
              <div className="co-card__header">
                <span className="co-card__step-num">2</span>
                <h2 className="co-card__title">Payment Method</h2>
              </div>

              <div className="payment-options">
                {PAYMENT_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className={`payment-option${values.paymentMethod === opt.value ? ' payment-option--selected' : ''}`}
                  >
                    <input
                      type="radio"
                      className="payment-option__radio"
                      name="paymentMethod"
                      value={opt.value}
                      checked={values.paymentMethod === opt.value}
                      onChange={handleChange}
                    />
                    <span className="payment-option__icon">{opt.icon}</span>
                    <span className="payment-option__label">
                      <strong>{opt.label}</strong>
                      <small>{opt.desc}</small>
                    </span>
                  </label>
                ))}
              </div>

              {/* Credit Card fields */}
              {values.paymentMethod === 'card' && (
                <div className="card-payment-section">
                  {/* Visual card preview */}
                  <div className="mock-card-preview">
                    <div className="mock-card-chip">💳</div>
                    <div className="mock-card-number">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </div>
                    <div className="mock-card-bottom">
                      <div>
                        <div className="mock-card-label">Card Holder</div>
                        <div className="mock-card-holder">{cardName || values.fullName || 'YOUR NAME'}</div>
                      </div>
                      <div>
                        <div className="mock-card-label">Expires</div>
                        <div className="mock-card-expiry">{cardExpiry || 'MM/YY'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="card-inputs">
                    <div className="card-input-group">
                      <label>Name on Card</label>
                      <input
                        type="text"
                        className="inputBox"
                        placeholder="As printed on card"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        maxLength={26}
                      />
                    </div>

                    <div className="card-input-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        className="inputBox"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength={19}
                      />
                      {cardErrors.cardNumber && <span className="error">{cardErrors.cardNumber}</span>}
                    </div>

                    <div className="form-row">
                      <div className="form-group card-input-group">
                        <label>Expiry Date</label>
                        <input
                          type="text"
                          className="inputBox"
                          placeholder="MM/YY"
                          value={cardExpiry}
                          onChange={handleExpiryChange}
                          maxLength={5}
                        />
                        {cardErrors.cardExpiry && <span className="error">{cardErrors.cardExpiry}</span>}
                      </div>

                      <div className="form-group card-input-group">
                        <label>CVV</label>
                        <input
                          type="password"
                          className="inputBox"
                          placeholder="•••"
                          value={cardCvv}
                          onChange={handleCvvChange}
                          maxLength={4}
                        />
                        {cardErrors.cardCvv && <span className="error">{cardErrors.cardCvv}</span>}
                      </div>
                    </div>

                    <p className="card-mock-note">
                      <i className="fa-solid fa-lock"></i> Card details are for demo only and not stored.
                    </p>
                  </div>
                </div>
              )}

              {values.paymentMethod === 'cod' && (
                <div className="cod-info">
                  <i className="fa-solid fa-money-bill-wave"></i>
                  <span>Pay with cash when your order is delivered.</span>
                </div>
              )}

              {values.paymentMethod === 'upi' && (
                <div className="cod-info" style={{ background: '#f0f4ff', borderColor: '#c7d2fe', color: '#3730a3' }}>
                  <i className="fa-solid fa-mobile-screen"></i>
                  <span>You'll receive a UPI payment request after placing your order.</span>
                </div>
              )}
            </div>

            {/* Step 3 – Order Notes */}
            <div className="co-card">
              <div className="co-card__header">
                <span className="co-card__step-num">3</span>
                <h2 className="co-card__title">Order Notes <span style={{ fontWeight: 400, fontSize: 14, color: '#888' }}>(Optional)</span></h2>
              </div>
              <textarea
                className="inputBox"
                placeholder="Any special instructions for your order…"
                name="notes"
                value={values.notes}
                onChange={handleChange}
                rows="3"
                style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical' }}
              />
            </div>

            {/* Actions */}
            <div className="checkout-actions">
              <button onClick={() => navigate('/cart')} className="cancel-button">
                <i className="fa-solid fa-arrow-left"></i> Back to Cart
              </button>
              <button onClick={handlePlaceOrder} className="appButton" disabled={orderLoading}>
                {orderLoading
                  ? <><i className="fa-solid fa-spinner fa-spin"></i> Placing Order…</>
                  : <><i className="fa-solid fa-lock"></i> Place Order</>
                }
              </button>
            </div>
          </div>

          {/* ── Right column: Order Summary ── */}
          <div className="order-summary-sidebar">
            <h3>Order Summary</h3>

            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item._id} className="summary-item">
                  <div className="summary-item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-details">${Number(item.price).toFixed(2)} × {item.quantity}</p>
                  </div>
                  <p className="item-subtotal">${(Number(item.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="summary-divider" />

            <div className="summary-row">
              <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items):</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span className="free-text">FREE</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>$0.00</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Order Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            {/* Security badge */}
            <div className="security-badge">
              <i className="fa-solid fa-lock"></i>
              <span>Secure checkout — your data is protected</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
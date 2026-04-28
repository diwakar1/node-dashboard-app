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

  return (
    <div className="container">

      {/* ── Order Success Modal ── */}
      {orderSuccess && (
        <div className="order-modal-overlay">
          <div className="order-modal">
            <div className="order-modal-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2>Order Placed Successfully!</h2>
            <p className="order-modal-sub">
              Thank you for your order. We'll get it ready for you soon.
            </p>

            <div className="order-modal-details">
              <div className="order-modal-row">
                <span>Order ID</span>
                <span className="order-modal-value">#{orderSuccess._id.slice(-8).toUpperCase()}</span>
              </div>
              <div className="order-modal-row">
                <span>Payment</span>
                <span className="order-modal-value">
                  {orderSuccess.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit / Debit Card'}
                </span>
              </div>
              <div className="order-modal-row">
                <span>Items</span>
                <span className="order-modal-value">{orderSuccess.items.length}</span>
              </div>
              <div className="order-modal-row order-modal-total">
                <span>Total</span>
                <span>${orderSuccess.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="appButton order-modal-btn"
              onClick={() => navigate('/orders')}
            >
              <i className="fa-solid fa-bag-shopping"></i> View My Orders
            </button>
            <button
              className="continue-link"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

      <div className="checkout-page">
        <h2>Checkout</h2>

        {orderError && (
          <div className="order-error-banner">
            <i className="fa-solid fa-triangle-exclamation"></i> {orderError}
          </div>
        )}

        <div className="checkout-layout">
          <div className="checkout-form">
            <h3>Shipping Address</h3>
            
            <input
              type="text"
              className="inputBox"
              placeholder="Full Name"
              name="fullName"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.fullName && <span className="error">{errors.fullName}</span>}

            <input
              type="text"
              className="inputBox"
              placeholder="Address"
              name="address"
              value={values.address}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.address && <span className="error">{errors.address}</span>}

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  className="inputBox"
                  placeholder="City"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.city && <span className="error">{errors.city}</span>}
              </div>

              <div className="form-group">
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
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  className="inputBox"
                  placeholder="Zip Code"
                  name="zipCode"
                  value={values.zipCode}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.zipCode && <span className="error">{errors.zipCode}</span>}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  className="inputBox"
                  placeholder="Phone (10 digits)"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </div>
            </div>

            <h3>Payment Method</h3>
            <select
              className="inputBox"
              name="paymentMethod"
              value={values.paymentMethod}
              onChange={handleChange}
            >
              <option value="cod">Cash on Delivery</option>
              <option value="card">Credit / Debit Card</option>
              <option value="upi">UPI</option>
            </select>

            {/* ── Credit Card Form ── */}
            {values.paymentMethod === 'card' && (
              <div className="card-inputs">
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
                  {cardErrors.cardNumber && (
                    <span className="error">{cardErrors.cardNumber}</span>
                  )}
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
                    {cardErrors.cardExpiry && (
                      <span className="error">{cardErrors.cardExpiry}</span>
                    )}
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
                    {cardErrors.cardCvv && (
                      <span className="error">{cardErrors.cardCvv}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {values.paymentMethod === 'cod' && (
              <div className="cod-info">
                <i className="fa-solid fa-money-bill-wave"></i>
                <span>Pay with cash when your order is delivered.</span>
              </div>
            )}

            <textarea
              className="inputBox"
              placeholder="Order Notes (Optional)"
              name="notes"
              value={values.notes}
              onChange={handleChange}
              rows="3"
            />

            <div className="checkout-actions">
              <button 
                onClick={() => navigate('/cart')}
                className="cancel-button"
              >
                Back to Cart
              </button>
              <button 
                onClick={handlePlaceOrder}
                className="appButton"
                disabled={orderLoading}
              >
                {orderLoading ? (
                  <><i className="fa-solid fa-spinner fa-spin"></i> Placing Order...</>
                ) : (
                  <><i className="fa-solid fa-lock"></i> Place Order</>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="order-summary-sidebar">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item._id} className="summary-item">
                  <div className="summary-item-info">
                    <p className="item-name">{item.name}</p>
                    <p className="item-details">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>
                  <p className="item-subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="summary-divider"></div>

            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping:</span>
              <span className="free-text">FREE</span>
            </div>

            <div className="summary-divider"></div>

            <div className="summary-total">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
/**
 * Checkout.js
 * Checkout page for placing orders with items from cart
 */
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../hooks/useOrders';
import { useForm } from '../../hooks/useForm';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { placeOrder, loading: orderLoading } = useOrders();

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
      fullName: { required: true, message: 'Full name is required' },
      address: { required: true, message: 'Address is required' },
      city: { required: true, message: 'City is required' },
      state: { required: true, message: 'State is required' },
      zipCode: { 
        required: true, 
        pattern: /^\d{5,6}$/,
        message: 'Invalid zip code (5-6 digits)' 
      },
      phone: { 
        required: true,
        pattern: /^\d{10}$/,
        message: 'Phone must be 10 digits' 
      }
    }
  });

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  const handlePlaceOrder = async () => {
    if (!validate()) {
      return;
    }

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
      clearCart(); // Clear cart after successful order
      alert('Order placed successfully!');
      navigate('/orders');
    } else {
      alert(`Failed to place order: ${result.error}`);
    }
  };

  if (cartItems.length === 0) {
    return null; // Will be redirected by useEffect
  }

  const totalAmount = getCartTotal();

  return (
    <div className="container">
      <div className="checkout-page">
        <h2>Checkout</h2>

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
                <input
                  type="text"
                  className="inputBox"
                  placeholder="State"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
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
              <option value="card">Credit/Debit Card</option>
              <option value="upi">UPI</option>
            </select>

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
                {orderLoading ? 'Placing Order...' : 'Place Order'}
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
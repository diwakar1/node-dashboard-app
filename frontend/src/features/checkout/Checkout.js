/**
 * Checkout.js
 * Simple checkout page for placing an order for a single product
 */
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useOrders } from '../../hooks/useOrders';
import { useForm } from '../../hooks/useForm';
import './Checkout.css';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { placeOrder, loading: orderLoading } = useOrders();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [productLoading, setProductLoading] = useState(true);

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
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    setProductLoading(true);
    const result = await getProductById(id);
    if (result.success) {
      setProduct(result.product);
    } else {
      alert('Product not found');
      navigate('/products');
    }
    setProductLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!validate()) {
      return;
    }

    if (quantity < 1) {
      alert('Quantity must be at least 1');
      return;
    }

    const orderData = {
      items: [
        {
          productId: product._id,
          quantity: quantity
        }
      ],
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
      alert('Order placed successfully!');
      navigate('/orders');
    } else {
      alert(`Failed to place order: ${result.error}`);
    }
  };

  if (productLoading) {
    return <div className="container"><p>Loading product...</p></div>;
  }

  if (!product) {
    return <div className="container"><p>Product not found</p></div>;
  }

  const totalAmount = product.price * quantity;

  return (
    <div className="container">
      <div className="checkout-page">
        <h2>Checkout</h2>

        <div className="checkout-layout">
          <div className="checkout-form">
            <div className="product-summary">
              <h3>Order Summary</h3>
              <div className="product-info">
                <p><strong>{product.name}</strong></p>
                <p>Price: ${product.price}</p>
                <p>Company: {product.company}</p>
                
                <div className="quantity-selector">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="quantity-input"
                  />
                </div>
                
                <div className="total">
                  <strong>Total: ${totalAmount.toFixed(2)}</strong>
                </div>
              </div>
            </div>

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
                onClick={() => navigate('/products')}
                className="cancel-button"
              >
                Cancel
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;

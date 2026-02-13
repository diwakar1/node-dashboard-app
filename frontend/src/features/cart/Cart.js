/**
 * Cart.js
 * Shopping cart page showing all items with quantity controls
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    const { 
        cartItems, 
        removeFromCart, 
        updateQuantity, 
        clearCart, 
        getCartTotal,
        getCartCount 
    } = useCart();

    const handleQuantityChange = (productId, newQuantity) => {
        const qty = parseInt(newQuantity);
        if (qty >= 1) {
            updateQuantity(productId, qty);
        }
    };

    const handleIncrement = (productId, currentQuantity) => {
        updateQuantity(productId, currentQuantity + 1);
    };

    const handleDecrement = (productId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateQuantity(productId, currentQuantity - 1);
        }
    };

    const handleRemove = (productId, productName) => {
        if (window.confirm(`Remove "${productName}" from cart?`)) {
            removeFromCart(productId);
        }
    };

    const handleClearCart = () => {
        if (window.confirm('Clear all items from cart?')) {
            clearCart();
        }
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="container">
                <div className="cart-empty">
                    <i className="fa-solid fa-shopping-cart" style={{ fontSize: '64px', color: '#ccc' }}></i>
                    <h2>Your Cart is Empty</h2>
                    <p>Add some products to your cart to get started!</p>
                    <button onClick={() => navigate('/products')} className="appButton">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="cart-container">
                <div className="cart-header">
                    <h1>Shopping Cart</h1>
                    <button onClick={handleClearCart} className="clear-cart-btn">
                        <i className="fa-solid fa-trash"></i> Clear Cart
                    </button>
                </div>

                <div className="cart-content">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                <div className="cart-item-info">
                                    <h3>{item.name}</h3>
                                    <p className="cart-item-company">{item.company}</p>
                                    {item.categoryId && (
                                        <p className="cart-item-category">
                                            <i className={item.categoryId.icon} style={{ color: item.categoryId.color }}></i>
                                            {' '}{item.categoryId.name}
                                        </p>
                                    )}
                                </div>

                                <div className="cart-item-price">
                                    <span className="price-label">Price:</span>
                                    <span className="price-value">${item.price}</span>
                                </div>

                                <div className="cart-item-quantity">
                                    <button 
                                        onClick={() => handleDecrement(item._id, item.quantity)}
                                        className="qty-btn"
                                        disabled={item.quantity <= 1}
                                    >
                                        <i className="fa-solid fa-minus"></i>
                                    </button>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.quantity}
                                        onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                        className="qty-input"
                                    />
                                    <button 
                                        onClick={() => handleIncrement(item._id, item.quantity)}
                                        className="qty-btn"
                                    >
                                        <i className="fa-solid fa-plus"></i>
                                    </button>
                                </div>

                                <div className="cart-item-subtotal">
                                    <span className="subtotal-label">Subtotal:</span>
                                    <span className="subtotal-value">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>

                                <button 
                                    onClick={() => handleRemove(item._id, item.name)}
                                    className="remove-btn"
                                    title="Remove from cart"
                                >
                                    <i className="fa-solid fa-times"></i>
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        
                        <div className="summary-row">
                            <span>Items ({getCartCount()}):</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>

                        <div className="summary-row">
                            <span>Shipping:</span>
                            <span className="free-shipping">FREE</span>
                        </div>

                        <div className="summary-divider"></div>

                        <div className="summary-row summary-total">
                            <span>Total:</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>

                        <button onClick={handleCheckout} className="checkout-btn">
                            <i className="fa-solid fa-lock"></i> Proceed to Checkout
                        </button>

                        <button onClick={() => navigate('/products')} className="continue-shopping-btn">
                            <i className="fa-solid fa-arrow-left"></i> Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

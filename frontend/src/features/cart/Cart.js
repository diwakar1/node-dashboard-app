/**
 * Cart.js
 * Shopping cart page showing all items with quantity controls
 */
import React, { useState } from 'react';
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

    // Confirmation dialog state
    const [confirmDialog, setConfirmDialog] = useState(null);
    // { message, onConfirm }

    const showConfirm = (message, onConfirm) => {
        setConfirmDialog({ message, onConfirm });
    };

    const handleConfirmYes = () => {
        if (confirmDialog) confirmDialog.onConfirm();
        setConfirmDialog(null);
    };

    const handleConfirmNo = () => {
        setConfirmDialog(null);
    };

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
        if (currentQuantity >= 1) {
            updateQuantity(productId, currentQuantity - 1);
        }
    };

    const handleRemove = (productId, productName) => {
        showConfirm(`Remove "${productName}" from cart?`, () => removeFromCart(productId));
    };

    const handleClearCart = () => {
        showConfirm('Clear all items from cart?', () => clearCart());
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <div className="cart-page__inner">
                    <h1 className="cart-page__title">Shopping Cart</h1>
                    <div className="cart-empty">
                        <div className="cart-empty__icon">
                            <i className="fa-solid fa-cart-shopping"></i>
                        </div>
                        <h2 className="cart-empty__heading">Your cart is empty</h2>
                        <p className="cart-empty__sub">You have no items in your shopping cart.<br />Browse our products and add something you like!</p>
                        <button onClick={() => navigate('/products')} className="cart-empty__btn">
                            <i className="fa-solid fa-arrow-left"></i> Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">

            {/* Confirmation Dialog */}
            {confirmDialog && (
                <div className="cart-modal-overlay">
                    <div className="cart-confirm-dialog">
                        <div className="cart-confirm-icon">
                            <i className="fa-solid fa-circle-exclamation"></i>
                        </div>
                        <p className="cart-confirm-message">{confirmDialog.message}</p>
                        <div className="cart-confirm-actions">
                            <button className="cart-confirm-no" onClick={handleConfirmNo}>Cancel</button>
                            <button className="cart-confirm-yes" onClick={handleConfirmYes}>Remove</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="cart-page__inner">
                <div className="cart-page__header">
                    <h1 className="cart-page__title">
                        Shopping Cart
                        <span className="cart-page__count">{getCartCount()} {getCartCount() === 1 ? 'item' : 'items'}</span>
                    </h1>
                    <button onClick={handleClearCart} className="cart-clear-btn">
                        <i className="fa-solid fa-trash"></i> Clear Cart
                    </button>
                </div>

                <div className="cart-layout">
                    {/* Items column */}
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div key={item._id} className="cart-item">
                                {/* Item image placeholder */}
                                <div className="cart-item__img">
                                    <i className="fa-solid fa-box" style={{ fontSize: 28, color: '#aaa' }}></i>
                                </div>

                                {/* Info */}
                                <div className="cart-item__info">
                                    <h3 className="cart-item__name">{item.name}</h3>
                                    {item.company && <p className="cart-item__meta">{item.company}</p>}
                                    {item.categoryId && (
                                        <p className="cart-item__meta">
                                            <i className={item.categoryId.icon} style={{ color: item.categoryId.color, marginRight: 4 }}></i>
                                            {item.categoryId.name}
                                        </p>
                                    )}
                                    <p className="cart-item__unit-price">${Number(item.price).toFixed(2)} each</p>

                                    {/* Qty controls + remove on same row */}
                                    <div className="cart-item__actions">
                                        <div className="qty-control">
                                            <button className="qty-btn" onClick={() => handleDecrement(item._id, item.quantity)} disabled={item.quantity <= 1}>
                                                <i className="fa-solid fa-minus"></i>
                                            </button>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => handleQuantityChange(item._id, e.target.value)}
                                                className="qty-input"
                                            />
                                            <button className="qty-btn" onClick={() => handleIncrement(item._id, item.quantity)}>
                                                <i className="fa-solid fa-plus"></i>
                                            </button>
                                        </div>
                                        <span className="cart-item__sep">|</span>
                                        <button className="cart-item__remove" onClick={() => handleRemove(item._id, item.name)}>
                                            <i className="fa-solid fa-trash-can"></i> Delete
                                        </button>
                                    </div>
                                </div>

                                {/* Subtotal */}
                                <div className="cart-item__subtotal">
                                    ${(Number(item.price) * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary sidebar */}
                    <div className="cart-summary">
                        <div className="cart-summary__title">Order Summary</div>

                        <div className="cart-summary__row">
                            <span>Items ({getCartCount()}):</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>
                        <div className="cart-summary__row">
                            <span>Shipping:</span>
                            <span className="cart-summary__free">FREE</span>
                        </div>
                        <div className="cart-summary__row">
                            <span>Tax:</span>
                            <span>$0.00</span>
                        </div>

                        <div className="cart-summary__divider"></div>

                        <div className="cart-summary__total">
                            <span>Order Total:</span>
                            <span>${getCartTotal().toFixed(2)}</span>
                        </div>

                        <button onClick={handleCheckout} className="cart-checkout-btn">
                            <i className="fa-solid fa-lock"></i> Proceed to Checkout
                        </button>

                        <button onClick={() => navigate('/products')} className="cart-continue-btn">
                            <i className="fa-solid fa-arrow-left"></i> Continue Shopping
                        </button>

                        <div className="cart-summary__secure">
                            <i className="fa-solid fa-lock"></i> Secure checkout
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;

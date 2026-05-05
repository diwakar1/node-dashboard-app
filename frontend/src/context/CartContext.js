/**
 * CartContext.js
 * Global cart state management with localStorage persistence
 */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Scope the storage key to the logged-in user so carts never bleed between accounts.
    const cartKey = user?._id ? `cart_${user._id}` : null;

    // Reload cart whenever the user changes (login, logout, SSO switch).
    // Wait for auth to finish initialising first.
    useEffect(() => {
        if (authLoading) return;
        if (cartKey) {
            try {
                const saved = localStorage.getItem(cartKey);
                setCartItems(saved ? JSON.parse(saved) : []);
            } catch {
                setCartItems([]);
            }
        } else {
            // No user logged in — show empty cart
            setCartItems([]);
        }
        setLoading(false);
    }, [cartKey, authLoading]);

    // Persist cart under the user-specific key whenever it changes
    useEffect(() => {
        if (!loading && cartKey) {
            try {
                localStorage.setItem(cartKey, JSON.stringify(cartItems));
            } catch {}
        }
    }, [cartItems, loading, cartKey]);

    // Add item to cart
    const addToCart = (product, quantity = 1) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item._id === product._id);
            
            if (existingItem) {
                // Update quantity if item already exists
                return prevItems.map(item =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                // Add new item
                return [...prevItems, { ...product, quantity }];
            }
        });
    };

    // Remove item from cart
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
    };

    // Update item quantity
    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        
        setCartItems(prevItems =>
            prevItems.map(item =>
                item._id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    // Clear entire cart
    const clearCart = () => {
        setCartItems([]);
    };

    // Get cart item count
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Get cart total price
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    // Check if product is in cart
    const isInCart = (productId) => {
        return cartItems.some(item => item._id === productId);
    };

    // Get item quantity from cart
    const getItemQuantity = (productId) => {
        const item = cartItems.find(item => item._id === productId);
        return item ? item.quantity : 0;
    };

    const value = {
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartCount,
        getCartTotal,
        isInCart,
        getItemQuantity
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};

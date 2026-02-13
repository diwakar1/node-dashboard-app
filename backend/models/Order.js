/**
 * Order.js
 * Defines the Order model schema for MongoDB using Mongoose.
 * Represents customer orders with items, shipping, and status tracking.
 */
import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true,
        min: 0
    }
}, { _id: false });

const shippingAddressSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
        index: true
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: (items) => items.length > 0,
            message: 'Order must have at least one item'
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
        index: true
    },
    shippingAddress: {
        type: shippingAddressSchema,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cod', 'card', 'upi'],
        default: 'cod'
    },
    notes: String
}, {
    timestamps: true
});

// Index for efficient queries
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model('orders', orderSchema);

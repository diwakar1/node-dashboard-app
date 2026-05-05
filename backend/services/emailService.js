/**
 * emailService.js
 * Handles all outbound email sending via SMTP (nodemailer + Gmail App Password).
 * Provides: verification emails and order confirmation emails.
 */

import nodemailer from 'nodemailer';

const log = (...args) => console.log('[EmailService]', ...args);

// Lazy transporter: created on first use so that dotenv has already populated
// process.env by the time we read SMTP_USER / SMTP_PASS.
let _transporter = null;

const getTransporter = () => {
    if (!_transporter) {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('SMTP_USER and SMTP_PASS must be set in .env');
        }
        _transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // STARTTLS
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
        log('SMTP transporter initialised for:', process.env.SMTP_USER);
    }
    return _transporter;
};

/**
 * Send email verification link to newly registered user.
 * @param {Object} user - Mongoose user document
 * @param {string} token - Verification token (stored hashed on user)
 */
export const sendVerificationEmail = async (user, token) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${frontendUrl}/verify-email?token=${token}`;

    const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
            <h2 style="color:#2563eb;">Verify your email address</h2>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Thank you for signing up. Please click the button below to verify your email address.</p>
            <p>This link expires in <strong>24 hours</strong>.</p>
            <p style="margin:32px 0;">
                <a href="${link}"
                   style="background:#2563eb;color:#fff;padding:12px 28px;
                          border-radius:6px;text-decoration:none;font-size:15px;">
                    Verify Email
                </a>
            </p>
            <p style="color:#6b7280;font-size:13px;">
                If you did not create an account, you can safely ignore this email.
            </p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
            <p style="color:#6b7280;font-size:12px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${link}" style="color:#2563eb;">${link}</a>
            </p>
        </div>
    `;

    await getTransporter().sendMail({
        from: `"Dashboard App" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Verify your email address',
        html,
    });

    log('Verification email sent to:', user.email);
};

/**
 * Send order confirmation email if user's email is verified.
 * @param {Object} user  - Plain user object (name, email, isEmailVerified)
 * @param {Object} order - Mongoose order document
 */
export const sendOrderConfirmationEmail = async (user, order) => {
    if (!user.isEmailVerified) {
        log('Skipping order email — email not verified for:', user.email);
        return;
    }

    const itemsHtml = order.items
        .map(
            (item) => `
            <tr>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.name}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">$${item.price.toFixed(2)}</td>
                <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">$${(item.price * item.quantity).toFixed(2)}</td>
            </tr>`
        )
        .join('');

    const address = order.shippingAddress
        ? `${order.shippingAddress.fullName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`
        : 'N/A';

    const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <h2 style="color:#16a34a;">Order Confirmed!</h2>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>Thank you for your order. Here's a summary:</p>

            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
                <thead>
                    <tr style="background:#f3f4f6;">
                        <th style="padding:8px 12px;text-align:left;">Product</th>
                        <th style="padding:8px 12px;text-align:center;">Qty</th>
                        <th style="padding:8px 12px;text-align:right;">Price</th>
                        <th style="padding:8px 12px;text-align:right;">Total</th>
                    </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot>
                    <tr>
                        <td colspan="3" style="padding:10px 12px;font-weight:bold;text-align:right;">Order Total:</td>
                        <td style="padding:10px 12px;font-weight:bold;text-align:right;">$${order.totalAmount.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>

            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod?.toUpperCase()}</p>
            <p><strong>Shipping to:</strong> ${address}</p>

            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
            <p style="color:#6b7280;font-size:13px;">
                You'll receive another email when your order ships. Thank you for shopping with us!
            </p>
        </div>
    `;

    await getTransporter().sendMail({
        from: `"Dashboard App" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: `Order Confirmed — #${order._id}`,
        html,
    });

    log('Order confirmation email sent to:', user.email, 'order:', order._id);
};

/**
 * Send password reset link email.
 * @param {Object} user - Mongoose user document
 * @param {string} token - Raw (unhashed) reset token
 */
export const sendPasswordResetEmail = async (user, token) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const link = `${frontendUrl}/reset-password?token=${token}`;

    const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;">
            <h2 style="color:#2563eb;">Reset your password</h2>
            <p>Hi <strong>${user.name}</strong>,</p>
            <p>We received a request to reset the password for your account associated with <strong>${user.email}</strong>.</p>
            <p>Click the button below to choose a new password. This link expires in <strong>1 hour</strong>.</p>
            <p style="margin:32px 0;">
                <a href="${link}"
                   style="background:#2563eb;color:#fff;padding:12px 28px;
                          border-radius:6px;text-decoration:none;font-size:15px;">
                    Reset Password
                </a>
            </p>
            <p style="color:#6b7280;font-size:13px;">
                If you did not request a password reset, you can safely ignore this email.
                Your password will not change.
            </p>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
            <p style="color:#6b7280;font-size:12px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${link}" style="color:#2563eb;">${link}</a>
            </p>
        </div>
    `;

    await getTransporter().sendMail({
        from: `"Dashboard App" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject: 'Reset your password',
        html,
    });

    log('Password reset email sent to:', user.email);
};

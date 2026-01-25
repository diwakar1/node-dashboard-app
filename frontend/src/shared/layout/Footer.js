import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faInstagram, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <div style={styles.pageWrapper}>
            <footer style={styles.footer}>
                <div style={styles.footerContent}>
                    {/* Account Management Links */}
                    <div style={styles.accountLinks}>
                        <a href="/edit-profile">Edit Profile</a> | 
                        <a href="/change-password">Change Password</a> | 
                        <a href="/account-settings">Account Settings</a> | 
                        <a href="/logout">Logout</a>
                    </div>

                    {/* Customer Support Links */}
                    <div style={styles.supportLinks}>
                        <a href="/help-center">Help Center</a> | 
                        <a href="/contact-support">Contact Support</a>
                    </div>

                    {/* Legal Information Links */}
                    <div style={styles.legalLinks}>
                        <a href="/privacy-policy">Privacy Policy</a> | 
                        <a href="/terms-conditions">Terms & Conditions</a> | 
                        <a href="/data-protection">Data Protection</a>
                    </div>

                    {/* Feedback Section */}
                    <div style={styles.feedbackLinks}>
                        <p>We value your feedback! <a href="/survey">Take our survey</a></p>
                    </div>

                    {/* Social Media Links */}
                    <div style={styles.socialLinks}>
                        <a href="https://facebook.com/yourcompany" target="_blank" style={styles.socialIcon}>
                            <FontAwesomeIcon icon={faFacebook} size="2x" />
                        </a>
                        <a href="https://instagram.com/yourcompany" target="_blank" style={styles.socialIcon}>
                            <FontAwesomeIcon icon={faInstagram} size="2x" />
                        </a>
                        <a href="https://twitter.com/yourcompany" target="_blank" style={styles.socialIcon}>
                            <FontAwesomeIcon icon={faTwitter} size="2x" />
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

const styles = {
    pageWrapper: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Ensure the wrapper takes up the full height
    },
    mainContent: {
        flex: 1, // Makes sure the main content takes up available space
        padding: "20px",
        backgroundColor: "#f0f0f0", // Optional styling for content area
    },
    footer: {
        backgroundColor: "#f8f9fa",
        padding: "20px",
        textAlign: "center",
        fontSize: "14px",
        color: "#6c757d",
        borderTop: "1px solid #ddd",
        marginBottom: "0", // Ensure no margin is added below content
    },
    footerContent: {
        maxWidth: "1200px",
        margin: "0 auto",
    },
    accountLinks: {
        marginBottom: "15px",
    },
    supportLinks: {
        marginBottom: "15px",
    },
    legalLinks: {
        marginBottom: "15px",
    },
    feedbackLinks: {
        marginBottom: "15px",
    },
    socialLinks: {
        marginBottom: "15px",
    },
    socialIcon: {
        margin: "0 10px",
        color: "#007BFF",
        textDecoration: "none", 
    },
};

export default Footer;

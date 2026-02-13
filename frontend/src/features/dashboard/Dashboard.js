/**
 * Dashboard.js
 * Main dashboard component showing statistics and category overview
 */
import React, { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../../api/category';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchDashboardStats();
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="dashboard-loading">Loading dashboard...</div>;
    }

    if (error) {
        return <div className="dashboard-error">Error: {error}</div>;
    }

    if (!stats) {
        return null;
    }

    return (
        <div className="dashboard-container">
            <h1>Dashboard</h1>

            {/* Overview Stats */}
            <div className="stats-overview">
                <Link to="/products" className="stat-card">
                    <i className="fa-solid fa-box"></i>
                    <div className="stat-info">
                        <h3>{stats.overview.totalProducts}</h3>
                        <p>Total Products</p>
                    </div>
                </Link>
                
                <Link to="/products" className="stat-card">
                    <i className="fa-solid fa-layer-group"></i>
                    <div className="stat-info">
                        <h3>{stats.overview.totalCategories}</h3>
                        <p>Categories</p>
                    </div>
                </Link>
                
                <Link to="/products" className="stat-card">
                    <i className="fa-solid fa-building"></i>
                    <div className="stat-info">
                        <h3>{stats.overview.totalCompanies}</h3>
                        <p>Companies</p>
                    </div>
                </Link>
            </div>

            {/* Categories Section */}
            <div className="dashboard-section">
                <h2>Categories</h2>
                <div className="category-grid">
                    {stats.categoryBreakdown.map((cat) => (
                        <Link 
                            to={`/products?category=${cat.categoryId}`} 
                            key={cat.categoryId}
                            className="category-card"
                            style={{ borderLeft: `4px solid ${cat.color}` }}
                        >
                            <i className={cat.icon} style={{ color: cat.color }}></i>
                            <div className="category-info">
                                <h3>{cat.name}</h3>
                                <p>{cat.productCount} product{cat.productCount !== 1 ? 's' : ''}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;

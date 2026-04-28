/**
 * Dashboard.js — Admin dashboard, Shopify/Amazon Seller style
 */
import React, { useState, useEffect } from 'react';
import { fetchDashboardStats } from '../../api/category';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const KPI_CONFIG = [
  { key: 'totalProducts',   label: 'Total Products',  icon: 'fa-solid fa-box',            color: '#3b82f6', bg: '#eff6ff', link: '/products' },
  { key: 'totalOrders',     label: 'Total Orders',    icon: 'fa-solid fa-bag-shopping',   color: '#f59e0b', bg: '#fffbeb', link: '/orders'   },
  { key: 'totalUsers',      label: 'Customers',       icon: 'fa-solid fa-users',          color: '#10b981', bg: '#ecfdf5', link: null        },
  { key: 'totalCategories', label: 'Categories',      icon: 'fa-solid fa-layer-group',    color: '#8b5cf6', bg: '#f5f3ff', link: '/products' },
  { key: 'totalCompanies',  label: 'Brands',          icon: 'fa-solid fa-building',       color: '#06b6d4', bg: '#ecfeff', link: null        },
  { key: 'totalRevenue',    label: 'Revenue (Delivered)', icon: 'fa-solid fa-dollar-sign', color: '#22c55e', bg: '#f0fdf4', link: '/orders', isRevenue: true },
];

function Dashboard() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => { loadDashboard(); }, []);

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

  if (loading) return (
    <div className="db-loading">
      <i className="fa-solid fa-spinner fa-spin"></i> Loading dashboard…
    </div>
  );

  if (error) return (
    <div className="db-error">
      <i className="fa-solid fa-triangle-exclamation"></i> {error}
    </div>
  );

  if (!stats) return null;

  const ov = stats.overview;
  const maxCatCount = Math.max(...stats.categoryBreakdown.map(c => c.productCount), 1);

  return (
    <div className="db-page">

      {/* ── Page Header ── */}
      <div className="db-header">
        <div>
          <h1 className="db-title">
            <i className="fa-solid fa-gauge-high"></i> Admin Dashboard
          </h1>
          <p className="db-subtitle">Welcome back! Here&apos;s what&apos;s happening in your store.</p>
        </div>
        <div className="db-header-actions">
          <Link to="/add" className="db-action-btn db-btn-primary">
            <i className="fa-solid fa-plus"></i> Add Product
          </Link>
          <Link to="/orders" className="db-action-btn db-btn-secondary">
            <i className="fa-solid fa-bag-shopping"></i> View Orders
          </Link>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="db-kpi-grid">
        {KPI_CONFIG.map(cfg => {
          const val = ov[cfg.key] ?? 0;
          const display = cfg.isRevenue ? `$${Number(val).toFixed(2)}` : val;
          const card = (
            <div className="db-kpi-card" style={{ '--kpi-color': cfg.color, '--kpi-bg': cfg.bg }}>
              <div className="db-kpi-icon">
                <i className={cfg.icon}></i>
              </div>
              <div className="db-kpi-body">
                <span className="db-kpi-value">{display}</span>
                <span className="db-kpi-label">{cfg.label}</span>
              </div>
            </div>
          );
          return cfg.link
            ? <Link to={cfg.link} key={cfg.key} className="db-kpi-link">{card}</Link>
            : <div key={cfg.key}>{card}</div>;
        })}
      </div>

      {/* ── Main Content: Category Breakdown + Recent Products ── */}
      <div className="db-main-grid">

        {/* Category Breakdown */}
        <div className="db-panel">
          <div className="db-panel-header">
            <h2><i className="fa-solid fa-chart-bar"></i> Inventory by Category</h2>
            <Link to="/products" className="db-panel-link">View all →</Link>
          </div>
          <div className="db-cat-list">
            {stats.categoryBreakdown.map(cat => (
              <Link
                to={`/products?category=${cat.categoryId}`}
                key={cat.categoryId}
                className="db-cat-row"
              >
                <div className="db-cat-icon" style={{ background: cat.color + '1a', color: cat.color }}>
                  <i className={cat.icon}></i>
                </div>
                <div className="db-cat-info">
                  <span className="db-cat-name">{cat.name}</span>
                  <div className="db-cat-bar-wrap">
                    <div
                      className="db-cat-bar"
                      style={{
                        width: `${(cat.productCount / maxCatCount) * 100}%`,
                        background: cat.color
                      }}
                    ></div>
                  </div>
                </div>
                <span className="db-cat-count" style={{ color: cat.color }}>
                  {cat.productCount} <small>item{cat.productCount !== 1 ? 's' : ''}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="db-panel">
          <div className="db-panel-header">
            <h2><i className="fa-solid fa-clock-rotate-left"></i> Recently Added</h2>
            <Link to="/products" className="db-panel-link">View all →</Link>
          </div>
          <div className="db-recent-list">
            {stats.recentProducts.map(p => (
              <div key={p._id} className="db-recent-row">
                <div
                  className="db-recent-icon"
                  style={{
                    background: (p.categoryId?.color || '#888') + '1a',
                    color: p.categoryId?.color || '#888'
                  }}
                >
                  <i className={p.categoryId?.icon || 'fa-solid fa-tag'}></i>
                </div>
                <div className="db-recent-info">
                  <span className="db-recent-name">{p.name}</span>
                  <span className="db-recent-company">{p.company}</span>
                </div>
                <div className="db-recent-right">
                  <span className="db-recent-price">${Number(p.price).toFixed(2)}</span>
                  <span
                    className="db-recent-cat"
                    style={{ background: (p.categoryId?.color || '#888') + '1a', color: p.categoryId?.color || '#888' }}
                  >
                    {p.categoryId?.name || 'Uncategorized'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
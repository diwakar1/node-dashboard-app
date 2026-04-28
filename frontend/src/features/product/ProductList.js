import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

const ProductList = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const categoryId = new URLSearchParams(location.search).get("category");
	const { products, loading, error, removeProduct, searchProductsByKey, loadProducts, loadProductsByCategory } = useProducts({ autoLoad: false });
	const { isAdmin } = useAuth();
	const { addToCart, isInCart, getCartCount } = useCart();

	const [cartDialog, setCartDialog] = useState(null);
	const [searchQuery, setSearchQuery] = useState('');

	useEffect(() => {
		if (categoryId) {
			loadProductsByCategory(categoryId);
		} else {
			loadProducts();
		}
	}, [categoryId, loadProductsByCategory, loadProducts]);

	const handleSearch = (e) => {
		const val = e.target.value;
		setSearchQuery(val);
		searchProductsByKey(val);
	};

	const handleDelete = async (id) => {
		await removeProduct(id);
	};

	const handleAddToCart = (product) => {
		addToCart(product, 1);
		setCartDialog({ productName: product.name });
	};

	// Group products by category
	const grouped = useMemo(() => {
		const map = {};
		products.forEach(p => {
			const key = p.categoryId?._id || 'uncategorized';
			const label = p.categoryId?.name || 'Uncategorized';
			const icon  = p.categoryId?.icon  || 'fa-solid fa-tag';
			const color = p.categoryId?.color || '#888';
			if (!map[key]) map[key] = { label, icon, color, items: [] };
			map[key].items.push(p);
		});
		return Object.values(map);
	}, [products]);

	return (
		<div className="products-page">

			{/* ── Add to Cart Dialog ── */}
			{cartDialog && (
				<div className="cart-modal-overlay">
					<div className="cart-confirm-dialog">
						<div className="cart-confirm-icon" style={{ color: '#28a745' }}>
							<i className="fa-solid fa-circle-check"></i>
						</div>
						<p className="cart-confirm-message">
							<strong>"{cartDialog.productName}"</strong> was added to your cart!
						</p>
						<div className="cart-confirm-actions">
							<button className="cart-confirm-no" onClick={() => setCartDialog(null)}>
								Continue Shopping
							</button>
							<button
								className="cart-confirm-yes"
								style={{ background: '#28a745' }}
								onClick={() => { setCartDialog(null); navigate('/cart'); }}
							>
								<i className="fa-solid fa-cart-shopping"></i> Go to Cart ({getCartCount()})
							</button>
						</div>
					</div>
				</div>
			)}

			{/* ── Page Header ── */}
			<div className="products-header">
				<div className="products-title">
					<h2><i className="fa-solid fa-store"></i> Products</h2>
					{!loading && <span className="products-count">{products.length} item{products.length !== 1 ? 's' : ''}</span>}
				</div>
				<div className="products-search-wrap">
					<i className="fa-solid fa-magnifying-glass products-search-icon"></i>
					<input
						type="text"
						className="products-search-input"
						placeholder="Search products…"
						value={searchQuery}
						onChange={handleSearch}
					/>
					{searchQuery && (
						<button className="products-search-clear" onClick={() => { setSearchQuery(''); loadProducts(); }}>
							<i className="fa-solid fa-xmark"></i>
						</button>
					)}
				</div>
			</div>

			{loading && (
				<div className="products-loading">
					<i className="fa-solid fa-spinner fa-spin"></i> Loading products…
				</div>
			)}
			{error && <p className="error">{error}</p>}

			{!loading && !error && products.length === 0 && (
				<div className="products-empty">
					<i className="fa-solid fa-box-open"></i>
					<p>No products found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
				</div>
			)}

			{/* ── Unified Flat Card Grid ── */}
			{!loading && !error && products.length > 0 && (
				<div className="product-cards-grid">
					{products.map(product => {
						const catName  = product.categoryId?.name  || 'Uncategorized';
						const catIcon  = product.categoryId?.icon  || 'fa-solid fa-tag';
						const catColor = product.categoryId?.color || '#888';
						return (
							<div key={product._id} className="product-card">
								{/* Category badge */}
								<div className="product-card-cat-badge" style={{ background: catColor + '18', color: catColor }}>
									<i className={catIcon}></i> {catName}
								</div>

								<div className="product-card-body">
									<div className="product-card-name">{product.name}</div>
									<div className="product-card-company">
										<i className="fa-solid fa-building"></i> {product.company}
									</div>
									<div className="product-card-price">${Number(product.price).toFixed(2)}</div>
								</div>

								<div className="product-card-footer">
									{isAdmin() ? (
										<div className="product-card-admin-actions">
											<Link to={`/update/${product._id}`} className="update-btn">
												<i className="fa-solid fa-pen"></i> Edit
											</Link>
											<button onClick={() => handleDelete(product._id)} className="delete-btn">
												<i className="fa-solid fa-trash"></i> Delete
											</button>
										</div>
									) : (
										<button
											onClick={() => handleAddToCart(product)}
											className="add-to-cart-btn"
											disabled={isInCart(product._id)}
											style={{ width: '100%' }}
										>
											{isInCart(product._id) ? (
												<><i className="fa-solid fa-check"></i> In Cart</>
											) : (
												<><i className="fa-solid fa-cart-plus"></i> Add to Cart</>
											)}
										</button>
									)}
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
};
export default ProductList;

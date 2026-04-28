import React, { useEffect, useState } from "react";
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

	const [cartDialog, setCartDialog] = useState(null); // { productName }

	useEffect(() => {
		if (categoryId) {
			loadProductsByCategory(categoryId);
		} else {
			loadProducts();
		}
	}, [categoryId, loadProductsByCategory, loadProducts]);

	const handleSearch = (event) => {
		searchProductsByKey(event.target.value);
	};

	const handleDelete = async (id) => {
		await removeProduct(id);
	};

	const handleAddToCart = (product) => {
		addToCart(product, 1);
		setCartDialog({ productName: product.name });
	};

	return (
		<div className="product-list">

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
							<button
								className="cart-confirm-no"
								onClick={() => setCartDialog(null)}
							>
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
			<h3>Products Details</h3>
			<input type="" className="search-product-box" placeholder="search Prodct" onChange={handleSearch}/>
			{loading && <p>Loading products...</p>}
			{error && <p className="error">{error}</p>}
			{!loading && !error && (
				<>
					<ul>
						<li>S.No</li>
						<li>Name</li>
						<li>Price</li>
						<li>Category</li>
						<li>Comapany</li>
						<li>Actions</li>
					</ul>
					{ products.length>0?products.map((product, index) => (
					<ul key={product._id || index}>
						<li>{index+1}</li>
						<li>{product.name}</li>
						<li>{product.price}</li>
						<li>
							{product.categoryId ? (
								<span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
									<i className={product.categoryId.icon} style={{ color: product.categoryId.color }}></i>
									{product.categoryId.name}
								</span>
							) : 'N/A'}
						</li>
						<li>{product.company}</li>
						<li className="operation-buttons">
							{isAdmin() ? (
								<>
									<button onClick={()=>handleDelete(product._id)} className="delete-btn">Delete</button>
									<Link to={"/update/" + product._id} className="update-btn">Update</Link>
								</>
							) : (
								<button 
									onClick={() => handleAddToCart(product)} 
									className="add-to-cart-btn"
									disabled={isInCart(product._id)}
								>
									{isInCart(product._id) ? (
										<>
											<i className="fa-solid fa-check"></i> In Cart
										</>
									) : (
										<>
											<i className="fa-solid fa-cart-plus"></i> Add to Cart
										</>
									)}
								</button>
							)}
						</li>
					</ul>
					)):<h2>No result found</h2>
					}
				</>
			)}
		</div>
	);
};
export default ProductList;

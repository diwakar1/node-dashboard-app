import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useAuth } from "../../context/AuthContext";

const ProductList = () => {
	const location = useLocation();
	const categoryId = new URLSearchParams(location.search).get("category");
	const { products, loading, error, removeProduct, searchProductsByKey, loadProducts, loadProductsByCategory } = useProducts({ autoLoad: false });
	const { isAdmin } = useAuth();

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

	return (
		<div className="product-list">
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
								<Link to={`/checkout/${product._id}`} className="order-btn">Order</Link>
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

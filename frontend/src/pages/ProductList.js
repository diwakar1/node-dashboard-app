import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProducts, deleteProduct as deleteProductApi, searchProducts } from "../api/product";

const ProductList = () => {
	const [products, setProducts] = useState([]);

	useEffect(() => {
		getProducts();
	}, []);


	const getProducts = async () => {
		const data = await fetchProducts();
		setProducts(data);
	};


	const deleteProduct = async(id) =>{
		const resultJsonData = await deleteProductApi(id);
		if(resultJsonData){
			getProducts();
		}
	}


	const searchHandle = async(event) =>{
		let key = event.target.value;
		if(key){
			let modifiedData = await searchProducts(key);
			if(modifiedData){
				setProducts(modifiedData)
			}else{
				getProducts()
			}
		}else{
			getProducts()
		}
	}

	return (
		<div className="product-list">
			<h3>Products Details</h3>
			<input type="" className="search-product-box" placeholder="search Prodct" onChange={searchHandle}/>
			<ul>
				<li>S.No</li>
				<li>Name</li>
				<li>Price</li>
				<li>Category</li>
				<li>Comapany</li>
				 <li>Operations</li>
			</ul>
				{ products.length>0?products.map((product, index) => (
				 <ul key={product._id || index}>
					<li>{index+1}</li>
					<li>{product.name}</li>
					<li>{product.price}</li>
					<li>{product.category}</li>
					<li>{product.company}</li>
					<li className="operation-buttons">
					<button onClick={()=>deleteProduct(product._id)} className="delete-btn">Delete</button>
					<Link to={"/update/" + product._id} className="update-btn">Update</Link>
					</li>
				</ul>
			)):<h2>No result found</h2>
			}
		</div>
	);
};
export default ProductList;

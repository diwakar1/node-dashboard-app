import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct as addProductApi } from "../api/product";

const AddProduct = () => {
	const [name, setName] = useState("");
	const [price, setPrice] = useState("");
	const [category, setCategory] = useState("");
	const [company, setCompany] = useState("");
	const [error, setError] = useState(false);

	const navigate = useNavigate();

	const handleAddProduct = async () => {
		if (!name || !price || !category || !company) {
			setError(true);
			return;
		}
		let result = await addProductApi({ name, price, category, company });
		if (result) {
			navigate('/');
		}
	};

	return (
		<div className="container">
			 <div className="addProduct">
			<h3>Add product here</h3>

			<input
				type="text"
				className="inputBox"
				placeholder="Enter product name"
				value={name}
				onChange={(e) => setName(e.target.value)}
			/>
			{error && !name && <span className="invalid-input">Enter valid name</span>}

			<input
				type="text"
				className="inputBox"
				placeholder="Enter product price"
				value={price}
				onChange={(e) => setPrice(e.target.value)}
			/>
			{error && !price && <span className="invalid-input">Enter valid price</span>}

			<input
				type="text"
				className="inputBox"
				placeholder="Enter product category"
				value={category}
				onChange={(e) => setCategory(e.target.value)}
			/>
			{error && !category && <span className="invalid-input">Enter valid category</span>}

			<input
				type="text"
				className="inputBox"
				placeholder="Enter product company"
				value={company}
				onChange={(e) => setCompany(e.target.value)}
			/>
			{error && !company && <span className="invalid-input">Enter valid company</span>}

			<button className="appButton" type="button" onClick={handleAddProduct}>
				Add Product
			</button>
		</div>
		</div>
   
	);
};

export default AddProduct;

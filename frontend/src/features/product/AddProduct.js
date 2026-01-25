import React from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useForm } from "../../hooks/useForm";

const AddProduct = () => {
	const navigate = useNavigate();
	const { createProduct, loading, error: productError } = useProducts();
	
	const { values, errors, handleChange, handleBlur, validate } = useForm({
		initialValues: {
			name: "",
			price: "",
			category: "",
			company: ""
		},
		validationRules: {
			name: { required: true, message: "Enter valid name" },
			price: { required: true, message: "Enter valid price" },
			category: { required: true, message: "Enter valid category" },
			company: { required: true, message: "Enter valid company" }
		}
	});

	const handleAddProduct = async () => {
		if (!validate()) {
			return;
		}
		
		const result = await createProduct(values);
		if (result) {
			navigate('/');
		}
	};

	return (
		<div className="container">
			 <div className="addProduct">
			<h3>Add product here</h3>
			
			{productError && <span className="error">{productError}</span>}

			<input
				type="text"
				className="inputBox"
				placeholder="Enter product name"
				name="name"
				value={values.name}
				onChange={handleChange}
				onBlur={handleBlur}
			/>
			{errors.name && <span className="invalid-input">{errors.name}</span>}

			<input
				type="text"
				className="inputBox"
				placeholder="Enter product price"
				name="price"
				value={values.price}
				onChange={handleChange}
				onBlur={handleBlur}
			/>
			{errors.price && <span className="invalid-input">{errors.price}</span>}

			<input
				type="text"
				className="inputBox"
				placeholder="Enter product category"
				name="category"
				value={values.category}
				onChange={handleChange}
				onBlur={handleBlur}
			/>
			{errors.category && <span className="invalid-input">{errors.category}</span>}

			<input
				type="text"
				className="inputBox"
				placeholder="Enter product company"
				name="company"
				value={values.company}
				onChange={handleChange}
				onBlur={handleBlur}
			/>
			{errors.company && <span className="invalid-input">{errors.company}</span>}

			<button 
				className="appButton" 
				type="button" 
				onClick={handleAddProduct}
				disabled={loading}
			>
				{loading ? "Adding..." : "Add Product"}
			</button>
		</div>
		</div>
   
	);
};

export default AddProduct;

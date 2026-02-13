import React from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useForm } from "../../hooks/useForm";
import { useCategories } from "../../hooks/useCategories";

const AddProduct = () => {
	const navigate = useNavigate();
	const { createProduct, loading, error: productError } = useProducts();
	const { categories, loading: categoriesLoading } = useCategories();
	
	const { values, errors, handleChange, handleBlur, validate } = useForm({
		initialValues: {
			name: "",
			price: "",
			categoryId: "",
			company: ""
		},
		validationRules: {
			name: { required: true, message: "Enter valid name" },
			price: { required: true, message: "Enter valid price" },
			categoryId: { required: true, message: "Select a category" },
			company: { required: true, message: "Enter valid company" }
		}
	});

	const handleAddProduct = async () => {
		if (!validate()) {
			return;
		}
		
		const result = await createProduct(values);
		if (result?.success) {
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

			<select
				className="inputBox"
			name="categoryId"
			value={values.categoryId}
			onChange={handleChange}
			onBlur={handleBlur}
			disabled={categoriesLoading}
		>
			<option value="">Select Category</option>
			{categories.map((cat) => (
				<option key={cat._id} value={cat._id}>
					{cat.name}
				</option>
			))}
		</select>
		{errors.categoryId && <span className="invalid-input">{errors.categoryId}</span>}

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

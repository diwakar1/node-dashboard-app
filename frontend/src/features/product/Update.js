import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useForm } from "../../hooks/useForm";
import { useCategories } from "../../hooks/useCategories";

const Update = () => {
	const params = useParams();
	const navigate = useNavigate();
	const { editProduct, loading, error: productError, getProductById } = useProducts();
	const { categories, loading: categoriesLoading } = useCategories();

	const { values, errors, setValues, handleChange, handleBlur, validate } = useForm({
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

	useEffect(() => {
		getProductDetails();
	}, []);

	const getProductDetails = async () => {
		const product = await getProductById(params.id);
		if (product) {
			setValues({
				name: product.name,
				price: product.price,
				categoryId: product.categoryId?._id || product.categoryId || "",
				company: product.company
			});
		}
	};

	const handleUpdateProduct = async () => {
		if (!validate()) {
			return;
		}
		const result = await editProduct(params.id, values);
		if (result) {
			navigate("/");
		}
	};

	return (
		<div className="container">
			<div className="addProduct">
				<h3>Update product here</h3>
				
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
				{errors.name && (
					<span className="invalid-input">{errors.name}</span>
				)}

				<input
					type="text"
					className="inputBox"
					placeholder="Enter product price"
					name="price"
					value={values.price}
					onChange={handleChange}
					onBlur={handleBlur}
				/>
				{errors.price && (
					<span className="invalid-input">{errors.price}</span>
				)}

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
			{errors.categoryId && (
				<span className="invalid-input">{errors.categoryId}</span>
			)}

			<input
				type="text"
				className="inputBox"
				placeholder="Enter product company"
				name="company"
				value={values.company}
				onChange={handleChange}
				onBlur={handleBlur}
			/>
			{errors.company && (
				<span className="invalid-input">{errors.company}</span>
			)}

				<button
					className="appButton"
					type="button"
					onClick={handleUpdateProduct}
					disabled={loading}
				>
					{loading ? "Updating..." : "Update Product"}
				</button>
			</div>
		</div>
	);
};

export default Update;

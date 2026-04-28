import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useCategories } from "../../hooks/useCategories";
import "./ProductForm.css";

const Update = () => {
const { id } = useParams();
const navigate = useNavigate();
const { editProduct, loading, error: productError, getProductById } = useProducts();
const { categories, loading: categoriesLoading } = useCategories();

const [values, setValues] = useState({ name: "", price: "", categoryId: "", company: "" });
const [errors, setErrors] = useState({});
const [fetchLoading, setFetchLoading] = useState(true);
const [success, setSuccess] = useState(false);

useEffect(() => { loadProduct(); }, []);

const loadProduct = async () => {
setFetchLoading(true);
const result = await getProductById(id);
if (result.success && result.product) {
const p = result.product;
setValues({
name:       p.name,
price:      p.price,
categoryId: p.categoryId?._id || p.categoryId || "",
company:    p.company
});
}
setFetchLoading(false);
};

const validate = () => {
const e = {};
if (!values.name.trim())       e.name       = "Product name is required";
if (!values.price || isNaN(values.price) || Number(values.price) <= 0)
                               e.price      = "Enter a valid price greater than 0";
if (!values.categoryId)        e.categoryId = "Please select a category";
if (!values.company.trim())    e.company    = "Brand / company name is required";
setErrors(e);
return Object.keys(e).length === 0;
};

const handleChange = (e) => {
const { name, value } = e.target;
setValues(v => ({ ...v, [name]: value }));
if (errors[name]) setErrors(er => ({ ...er, [name]: "" }));
};

const handleSubmit = async () => {
if (!validate()) return;
const result = await editProduct(id, values);
if (result.success) {
setSuccess(true);
setTimeout(() => navigate("/products"), 1200);
}
};

if (fetchLoading) return (
<div className="pf-page" style={{ justifyContent: "center", alignItems: "center" }}>
<span style={{ color: "#64748b", fontSize: "1.1em" }}>
<i className="fa-solid fa-spinner fa-spin"></i> Loading product…
</span>
</div>
);

return (
<div className="pf-page">
<div className="pf-wrapper">

{/* Page header */}
<div className="pf-page-header">
<Link to="/products" className="pf-back-btn" title="Back to Products">
<i className="fa-solid fa-arrow-left"></i>
</Link>
<h1 className="pf-page-title">
<i className="fa-solid fa-pen-to-square"></i> Edit Product
</h1>
</div>

{/* Banners */}
{productError && (
<div className="pf-banner pf-banner-error">
<i className="fa-solid fa-triangle-exclamation"></i> {productError}
</div>
)}
{success && (
<div className="pf-banner pf-banner-success">
<i className="fa-solid fa-circle-check"></i> Product updated! Redirecting…
</div>
)}

{/* Form Card */}
<div className="pf-card">
<div className="pf-card-header">
<h3><i className="fa-solid fa-pen"></i> Edit Product Details</h3>
</div>

<div className="pf-card-body">
<div className="pf-grid">

{/* Product Name – full width */}
<div className="pf-field full">
<label className="pf-label">Product Name <span className="pf-required">*</span></label>
<div className="pf-input-wrap">
<i className="fa-solid fa-box pf-input-icon"></i>
<input
className={`pf-input has-icon ${errors.name ? "error" : ""}`}
type="text"
name="name"
placeholder="e.g. Sony WH-1000XM5 Headphones"
value={values.name}
onChange={handleChange}
/>
</div>
{errors.name && <span className="pf-error-msg"><i className="fa-solid fa-circle-exclamation"></i>{errors.name}</span>}
</div>

{/* Price */}
<div className="pf-field">
<label className="pf-label">Price (USD) <span className="pf-required">*</span></label>
<div className="pf-input-wrap">
<i className="fa-solid fa-dollar-sign pf-input-icon"></i>
<input
className={`pf-input has-icon ${errors.price ? "error" : ""}`}
type="number"
name="price"
placeholder="0.00"
min="0"
step="0.01"
value={values.price}
onChange={handleChange}
/>
</div>
{errors.price && <span className="pf-error-msg"><i className="fa-solid fa-circle-exclamation"></i>{errors.price}</span>}
</div>

{/* Category */}
<div className="pf-field">
<label className="pf-label">Category <span className="pf-required">*</span></label>
<div className="pf-select-wrap">
<select
className={`pf-select ${errors.categoryId ? "error" : ""}`}
name="categoryId"
value={values.categoryId}
onChange={handleChange}
disabled={categoriesLoading}
>
<option value="">Select a category…</option>
{categories.map(cat => (
<option key={cat._id} value={cat._id}>{cat.name}</option>
))}
</select>
</div>
{errors.categoryId && <span className="pf-error-msg"><i className="fa-solid fa-circle-exclamation"></i>{errors.categoryId}</span>}
</div>

{/* Company / Brand – full width */}
<div className="pf-field full">
<label className="pf-label">Brand / Company <span className="pf-required">*</span></label>
<div className="pf-input-wrap">
<i className="fa-solid fa-building pf-input-icon"></i>
<input
className={`pf-input has-icon ${errors.company ? "error" : ""}`}
type="text"
name="company"
placeholder="e.g. Sony, Apple, Samsung"
value={values.company}
onChange={handleChange}
/>
</div>
{errors.company && <span className="pf-error-msg"><i className="fa-solid fa-circle-exclamation"></i>{errors.company}</span>}
</div>

</div>
</div>

<div className="pf-actions">
<Link to="/products" className="pf-btn pf-btn-secondary">
<i className="fa-solid fa-xmark"></i> Cancel
</Link>
<button
className="pf-btn pf-btn-primary"
onClick={handleSubmit}
disabled={loading}
>
{loading
? <><i className="fa-solid fa-spinner fa-spin"></i> Saving…</>
: <><i className="fa-solid fa-floppy-disk"></i> Save Changes</>
}
</button>
</div>
</div>

</div>
</div>
);
};

export default Update;
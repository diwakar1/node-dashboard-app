import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { authFetch, API_BASE_URL, API_VERSION } from "../utils/auth";

const Update = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [company, setCompany] = useState("");
  const [error, setError] = useState(false);

  const params = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    getProductDetails();
  }, []);

  const getProductDetails = async () => {
    console.warn(params);
    let response = await authFetch(`${API_BASE_URL}${API_VERSION}/products/${params.id}`);
    let product = await response.json();
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
      setCompany(product.company);
    }
  };

  const handleUpdateProduct = async () => {
    if (!name || !price || !category || !company) {
      setError(true);
      return;
    }

    let response = await authFetch(`${API_BASE_URL}${API_VERSION}/products/${params.id}`, {
      method: "PUT",
      body: JSON.stringify({ name, price, category, company })
    });
    let result = await response.json();
    if (result) {
      navigate("/");
    }
  };

  return (
    <div className="container">
      <div className="addProduct">
        <h3>Update product here</h3>
        <input
          type="text"
          className="inputBox"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {error && !name && (
          <span className="invalid-input">Enter valid name</span>
        )}

        <input
          type="text"
          className="inputBox"
          placeholder="Enter product price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        {error && !price && (
          <span className="invalid-input">Enter valid price</span>
        )}

        <input
          type="text"
          className="inputBox"
          placeholder="Enter product category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        {error && !category && (
          <span className="invalid-input">Enter valid category</span>
        )}

        <input
          type="text"
          className="inputBox"
          placeholder="Enter product company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        {error && !company && (
          <span className="invalid-input">Enter valid company</span>
        )}

        <button
          className="appButton"
          type="button"
          onClick={handleUpdateProduct}
        >
          Update Product
        </button>
      </div>
    </div>
  );
};

export default Update;

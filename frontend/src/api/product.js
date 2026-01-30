import { authFetch, API_BASE_URL } from "./auth";
import { PRODUCT_ENDPOINTS } from "../constants/apiEndpoints";

// Fetch all products
export async function fetchProducts() {
  const response = await authFetch(`${API_BASE_URL}${PRODUCT_ENDPOINTS.GET_ALL}`);
  return response.json();
}

// Fetch a single product by ID
export async function fetchProductById(id) {
  const response = await authFetch(`${API_BASE_URL}${PRODUCT_ENDPOINTS.GET_BY_ID(id)}`);
  return response.json();
}

// Add a new product
export async function addProduct({ name, price, category, company }) {
  const response = await authFetch(`${API_BASE_URL}${PRODUCT_ENDPOINTS.CREATE}`, {
    method: "POST",
    body: JSON.stringify({ name, price, category, company })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.detail || "Failed to add product");
  }
  return data;
}

// Update a product
export async function updateProduct(id, { name, price, category, company }) {
  const response = await authFetch(`${API_BASE_URL}${PRODUCT_ENDPOINTS.UPDATE(id)}`, {
    method: "PUT",
    body: JSON.stringify({ name, price, category, company })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.detail || "Failed to update product");
  }
  return data;
}

// Delete a product
export async function deleteProduct(id) {
  const response = await authFetch(`${API_BASE_URL}${PRODUCT_ENDPOINTS.DELETE(id)}`, {
    method: "DELETE"
  });
  return response.json();
}

// Search products
export async function searchProducts(key) {
  const response = await authFetch(`${API_BASE_URL}${PRODUCT_ENDPOINTS.SEARCH(key)}`);
  return response.json();
}

import { authFetch, API_BASE_URL } from "./auth";
import { PRODUCT_ENDPOINTS } from "../constants/apiEndpoints";

/**
 * @typedef {import('@dashboard/shared').Product} Product
 */

/**
 * Fetch all products
 * @returns {Promise<Product[]>}
 */
export async function fetchProducts() {
  const response = await authFetch(`${API_BASE_URL}${PRODUCT_ENDPOINTS.GET_ALL}`);
  return response.json();
}

/**
 * Fetch a single product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Product>}
 */
export async function fetchProductById(id) {
  const response = await authFetch(`${API_BASE_URL}${PRODUCT_ENDPOINTS.GET_BY_ID(id)}`);
  return response.json();
}

/**
 * Add a new product
 * @param {Product} product - Product data (name, price, categoryId, company required)
 * @returns {Promise<Product>}
 */
export async function addProduct(product) {
  const response = await authFetch(`${API_BASE_URL}${PRODUCT_ENDPOINTS.CREATE}`, {
    method: "POST",
    body: JSON.stringify(product)
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.detail || "Failed to add product");
  }
  return data;
}

/**
 * Update a product
 * @param {string} id - Product ID
 * @param {Product} product - Updated product data (can include _id)
 * @returns {Promise<Product>}
 */
export async function updateProduct(id, product) {
  const response = await authFetch(`${API_BASE_URL}${PRODUCT_ENDPOINTS.UPDATE(id)}`, {
    method: "PUT",
    body: JSON.stringify(product)
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

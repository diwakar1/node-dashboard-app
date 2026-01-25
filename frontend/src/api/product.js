import { authFetch, API_BASE_URL, API_VERSION } from "./auth";

// Fetch all products
export async function fetchProducts() {
  const response = await authFetch(`${API_BASE_URL}${API_VERSION}/products`);
  return response.json();
}

// Fetch a single product by ID
export async function fetchProductById(id) {
  const response = await authFetch(`${API_BASE_URL}${API_VERSION}/products/${id}`);
  return response.json();
}

// Add a new product
export async function addProduct({ name, price, category, company }) {
  const response = await authFetch(`${API_BASE_URL}${API_VERSION}/products/add`, {
    method: "POST",
    body: JSON.stringify({ name, price, category, company })
  });
  return response.json();
}

// Update a product
export async function updateProduct(id, { name, price, category, company }) {
  const response = await authFetch(`${API_BASE_URL}${API_VERSION}/products/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, price, category, company })
  });
  return response.json();
}

// Delete a product
export async function deleteProduct(id) {
  const response = await authFetch(`${API_BASE_URL}${API_VERSION}/products/${id}`, {
    method: "DELETE"
  });
  return response.json();
}

// Search products
export async function searchProducts(key) {
  const response = await authFetch(`${API_BASE_URL}${API_VERSION}/products/search/${key}`);
  return response.json();
}

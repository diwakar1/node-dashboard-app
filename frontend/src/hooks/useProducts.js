import { useState, useEffect } from "react";
import { fetchProducts, fetchProductById, deleteProduct as deleteProductApi, searchProducts, addProduct, updateProduct } from "../api/product";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeProduct = async (id) => {
    setError(null);
    try {
      await deleteProductApi(id);
      await loadProducts(); // Refresh list
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const searchProductsByKey = async (key) => {
    if (!key) {
      await loadProducts();
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(key);
      setProducts(data || []);
    } catch (err) {
      setError(err.message);
      await loadProducts();
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData) => {
    setError(null);
    try {
      const result = await addProduct(productData);
      await loadProducts(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const editProduct = async (id, productData) => {
    setError(null);
    try {
      const result = await updateProduct(id, productData);
      await loadProducts(); // Refresh list
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  const getProductById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const product = await fetchProductById(id);
      return product;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Auto-load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    loadProducts,
    removeProduct,
    searchProductsByKey,
    createProduct,
    editProduct,
    getProductById,
  };
}

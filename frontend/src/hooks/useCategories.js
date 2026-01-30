/**
 * useCategories.js
 * Custom hook for category operations
 */
import { useState, useEffect } from 'react';
import { fetchCategories, fetchCategoryById, fetchProductsByCategory } from '../api/category';

export function useCategories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadCategories = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchCategories();
            setCategories(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return {
        categories,
        loading,
        error,
        loadCategories
    };
}

export function useCategoryProducts(categoryId) {
    const [categoryData, setCategoryData] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!categoryId) return;

        const loadCategoryProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchProductsByCategory(categoryId);
                setCategoryData(data.category);
                setProducts(data.products);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadCategoryProducts();
    }, [categoryId]);

    return {
        category: categoryData,
        products,
        loading,
        error
    };
}

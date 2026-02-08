/**
 * category.js
 * API functions for category and dashboard operations
 */
import { authFetch, API_BASE_URL } from './auth';

/**
 * @typedef {import('@dashboard/shared').Category} Category
 * @typedef {import('@dashboard/shared').DashboardStats} DashboardStats
 */

/**
 * Get all categories
 * @returns {Promise<Category[]>}
 */
export async function fetchCategories() {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return await response.json();
}

/**
 * Get single category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Category>}
 */
export async function fetchCategoryById(id) {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch category');
    }
    return await response.json();
}

/**
 * Get products by category
 * @param {string} categoryId - Category ID
 * @returns {Promise<any[]>}
 */
export async function fetchProductsByCategory(categoryId) {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/${categoryId}/products`);
    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data.products || [];
}

/**
 * Create new category (requires auth)
 * @param {Category} categoryData - Category data (name required, description/icon/color optional)
 * @returns {Promise<Category>}
 */
export async function createCategory(categoryData) {
    const response = await authFetch(`${API_BASE_URL}/api/v1/categories`, {
        method: 'POST',
        body: JSON.stringify(categoryData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create category');
    }
    
    return await response.json();
}

/**
 * Update category (requires auth)
 * @param {string} id - Category ID
 * @param {Category} categoryData - Updated category data (can include _id)
 * @returns {Promise<Category>}
 */
export async function updateCategory(id, categoryData) {
    const response = await authFetch(`${API_BASE_URL}/api/v1/categories/${id}`, {
        method: 'PUT',
        body: JSON.stringify(categoryData)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
    }
    
    return await response.json();
}

/**
 * Delete category (requires auth)
 */
export async function deleteCategory(id) {
    const response = await authFetch(`${API_BASE_URL}/api/v1/categories/${id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
    }
    
    return await response.json();
}

/**
 * Get dashboard statistics (requires auth)
 */
export async function fetchDashboardStats() {
    const response = await authFetch(`${API_BASE_URL}/api/v1/dashboard/stats`);
    
    if (!response.ok) {
        throw new Error('Failed to fetch dashboard statistics');
    }
    
    return await response.json();
}

/**
 * Get category statistics
 */
export async function fetchCategoryStats() {
    const response = await fetch(`${API_BASE_URL}/api/v1/categories/stats`);
    if (!response.ok) {
        throw new Error('Failed to fetch category statistics');
    }
    return await response.json();
}

/**
 * categoryService.js
 * Business logic for category operations
 */

/**
 * @typedef {import('@dashboard/shared').Category} Category
 */

const CategoryModel = require('../models/Category');
const ProductModel = require('../models/Product');

/**
 * Get all categories
 * @returns {Promise<Category[]>}
 */
async function getAllCategories() {
    try {
        const categories = await CategoryModel.find().sort({ name: 1 });
        return categories;
    } catch (error) {
        throw new Error('Failed to fetch categories: ' + error.message);
    }
}

/**
 * Get category by ID
 * @param {string} categoryId - Category ID
 * @returns {Promise<Category>}
 */
async function getCategoryById(categoryId) {
    try {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }
        return category;
    } catch (error) {
        throw new Error('Failed to fetch category: ' + error.message);
    }
}

/**
 * Create new category
 * @param {Category} categoryData - Category data
 * @returns {Promise<Category>}
 */
async function createCategory(categoryData) {
    try {
        const existingCategory = await CategoryModel.findOne({ name: categoryData.name });
        if (existingCategory) {
            throw new Error('Category with this name already exists');
        }

        const category = new CategoryModel(categoryData);
        await category.save();
        return category;
    } catch (error) {
        throw new Error('Failed to create category: ' + error.message);
    }
}

/**
 * Update category
 * @param {string} categoryId - Category ID
 * @param {Category} updateData - Updated category data
 * @returns {Promise<Category>}
 */
async function updateCategory(categoryId, updateData) {
    try {
        const category = await CategoryModel.findByIdAndUpdate(
            categoryId,
            updateData,
            { new: true, runValidators: true }
        );

        if (!category) {
            throw new Error('Category not found');
        }

        return category;
    } catch (error) {
        throw new Error('Failed to update category: ' + error.message);
    }
}

/**
 * Delete category
 */
async function deleteCategory(categoryId) {
    try {
        // Check if any products use this category
        const productsCount = await ProductModel.countDocuments({ categoryId: categoryId });
        if (productsCount > 0) {
            throw new Error(`Cannot delete category. ${productsCount} product(s) are using this category`);
        }

        const category = await CategoryModel.findByIdAndDelete(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }

        return category;
    } catch (error) {
        throw new Error('Failed to delete category: ' + error.message);
    }
}

/**
 * Get products by category ID
 */
async function getProductsByCategory(categoryId) {
    try {
        const category = await CategoryModel.findById(categoryId);
        if (!category) {
            throw new Error('Category not found');
        }

        const products = await ProductModel.find({ categoryId: categoryId })
            .populate('categoryId', 'name icon color');

        return {
            category,
            products,
            count: products.length
        };
    } catch (error) {
        throw new Error('Failed to fetch products: ' + error.message);
    }
}

/**
 * Get category statistics
 */
async function getCategoryStats() {
    try {
        const stats = await ProductModel.aggregate([
            {
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'categoryInfo'
                }
            },
            {
                $unwind: '$categoryInfo'
            },
            {
                $project: {
                    _id: 0,
                    categoryId: '$_id',
                    name: '$categoryInfo.name',
                    icon: '$categoryInfo.icon',
                    color: '$categoryInfo.color',
                    productCount: '$count'
                }
            },
            {
                $sort: { productCount: -1 }
            }
        ]);

        return stats;
    } catch (error) {
        throw new Error('Failed to fetch category statistics: ' + error.message);
    }
}

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getProductsByCategory,
    getCategoryStats
};

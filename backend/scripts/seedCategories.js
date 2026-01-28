/**
 * seedCategories.js
 * Seeds the database with default categories
 * 
 * Run: node scripts/seedCategories.js
 * self-Executing Script pattern
 */
require('dotenv').config(); // Load environment variables
require('../db/config');// Connect to the database
const Category = require('../models/Category');// Category model

const defaultCategories = [
    {
        name: 'Electronics',
        description: 'Electronic devices and gadgets',
        icon: 'fa-solid fa-laptop',
        color: '#3B82F6'
    },
    {
        name: 'Clothing',
        description: 'Apparel and fashion items',
        icon: 'fa-solid fa-shirt',
        color: '#EC4899'
    },
    {
        name: 'Food',
        description: 'Food and beverage products',
        icon: 'fa-solid fa-pizza-slice',
        color: '#F59E0B'
    },
    {
        name: 'Books',
        description: 'Books and educational materials',
        icon: 'fa-solid fa-book',
        color: '#8B5CF6'
    },
    {
        name: 'Home & Garden',
        description: 'Home improvement and garden items',
        icon: 'fa-solid fa-house',
        color: '#10B981'
    },
    {
        name: 'Sports',
        description: 'Sports equipment and accessories',
        icon: 'fa-solid fa-futbol',
        color: '#EF4444'
    },
    {
        name: 'Toys',
        description: 'Toys and games',
        icon: 'fa-solid fa-gamepad',
        color: '#06B6D4'
    },
    {
        name: 'Health & Beauty',
        description: 'Health and beauty products',
        icon: 'fa-solid fa-heart-pulse',
        color: '#F97316'
    }
];

async function seedCategories() {
    try {
        console.log('Seeding categories...');

        for (const categoryData of defaultCategories) {
            const category = await Category.findOneAndUpdate(
                { name: categoryData.name },
                categoryData,
                { upsert: true, new: true }
            );
            console.log(`Created: ${category.name} (${category.icon})`);
        }

        console.log(`Successfully seeded ${defaultCategories.length} categories!`);
        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seedCategories();

/**
 * migrateCategories.js
 * Migration script to extract existing categories from products
 * and convert them to use the new Category model.
 * 
 * Run this once: node scripts/migrateCategories.js
 */
require('dotenv').config();
require('../db/config');
const Product = require('../models/Product');
const Category = require('../models/Category');

async function migrateCategories() {
    try {
        console.log('Starting category migration...');

        // Get all products with old string-based categories
        const products = await Product.find().lean();
        
        if (products.length === 0) {
            console.log('No products found. Migration complete.');
            process.exit(0);
        }

        console.log(`Found ${products.length} products`);

        // Extract unique category names
        const categoryNames = [...new Set(
            products
                .map(p => p.category)
                .filter(cat => cat && typeof cat === 'string')
        )];

        console.log(`Found ${categoryNames.length} unique categories:`, categoryNames);

        // Create Category documents
        const categoryMap = {};
        for (const categoryName of categoryNames) {
            const category = await Category.findOneAndUpdate(
                { name: categoryName },
                { 
                    name: categoryName,
                    description: `${categoryName} products`
                },
                { upsert: true, new: true }
            );
            categoryMap[categoryName] = category._id;
            console.log(`Created/Updated category: ${categoryName}`);
        }

        // Update products to reference categories
        let updated = 0;
        for (const product of products) {
            if (typeof product.category === 'string' && categoryMap[product.category]) {
                await Product.findByIdAndUpdate(
                    product._id,
                    { categoryId: categoryMap[product.category] }
                );
                updated++;
            }
        }

        console.log(`Migration complete! Updated ${updated} products`);
        console.log(`Summary:`);
        console.log(`   - Categories created: ${categoryNames.length}`);
        console.log(`   - Products updated: ${updated}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrateCategories();

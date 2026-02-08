/**
 * renameCategoryField.js
 * Migration script to rename 'category' field to 'categoryId' in all products
 * 
 * Run this once: node scripts/renameCategoryField.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
require('../db/config');

async function renameCategoryField() {
    try {
        console.log('Starting field rename migration...');

        // Get direct access to products collection (bypass mongoose schema validation)
        const db = mongoose.connection.db;
        const productsCollection = db.collection('products');

        // Count products with old 'category' field
        const oldFieldCount = await productsCollection.countDocuments({ category: { $exists: true } });
        console.log(`Found ${oldFieldCount} products with 'category' field`);

        if (oldFieldCount === 0) {
            console.log('No products need migration. All products already use categoryId.');
            process.exit(0);
        }

        // Rename 'category' to 'categoryId' for all products
        const result = await productsCollection.updateMany(
            { category: { $exists: true } },
            { $rename: { category: 'categoryId' } }
        );

        console.log(`Migration complete!`);
        console.log(`   - Products updated: ${result.modifiedCount}`);
        console.log(`   - Matched: ${result.matchedCount}`);
        
        // Verify the migration
        const newFieldCount = await productsCollection.countDocuments({ categoryId: { $exists: true } });
        const remainingOldField = await productsCollection.countDocuments({ category: { $exists: true } });
        
        console.log(`\nVerification:`);
        console.log(`   - Products with categoryId: ${newFieldCount}`);
        console.log(`   - Products with old category field: ${remainingOldField}`);
        
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

// Wait for connection before running
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    renameCategoryField();
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
});

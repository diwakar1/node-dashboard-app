/**
 * assignProductsToAdmin.js
 * Migration script to assign all existing products without userId to admin user
 * 
 * Run: node scripts/assignProductsToAdmin.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import '../db/config.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

async function assignProductsToAdmin() {
    try {
        console.log('Starting product assignment migration...');

        // Find admin user
        const admin = await User.findOne({ role: 'admin' });
        
        if (!admin) {
            console.error('❌ No admin user found. Please run seedAdmin.js first.');
            process.exit(1);
        }

        console.log(`Found admin user: ${admin.email} (${admin._id})`);

        // Find all products without proper userId or with empty userId
        const productsToUpdate = await Product.find({
            $or: [
                { userId: { $exists: false } },
                { userId: '' },
                { userId: null }
            ]
        });

        console.log(`Found ${productsToUpdate.length} products to assign to admin`);

        if (productsToUpdate.length === 0) {
            console.log('✅ No products need updating. All products already have owners.');
            process.exit(0);
        }

        // Update all products to belong to admin
        const result = await Product.updateMany(
            {
                $or: [
                    { userId: { $exists: false } },
                    { userId: '' },
                    { userId: null }
                ]
            },
            {
                $set: { userId: admin._id.toString() }
            }
        );

        console.log(`✅ Migration complete!`);
        console.log(`   - Products updated: ${result.modifiedCount}`);
        console.log(`   - All products now owned by: ${admin.email}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
}

assignProductsToAdmin();

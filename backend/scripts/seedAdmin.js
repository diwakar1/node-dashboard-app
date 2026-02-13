/**
 * seedAdmin.js
 * Creates a default admin user for testing
 * 
 * Run: node scripts/seedAdmin.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import '../db/config.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const adminUser = {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    role: 'admin'
};

async function seedAdmin() {
    try {
        console.log('Creating admin user...');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminUser.email });
        
        if (existingAdmin) {
            console.log('Admin user already exists. Updating role...');
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('✅ Admin role updated for:', adminUser.email);
        } else {
            // Create new admin user
            const hashedPassword = await bcrypt.hash(adminUser.password, 10);
            
            const admin = new User({
                name: adminUser.name,
                email: adminUser.email,
                password: hashedPassword,
                role: 'admin'
            });

            await admin.save();
            console.log('✅ Admin user created successfully!');
        }

        console.log('\nAdmin Credentials:');
        console.log('Email:', adminUser.email);
        console.log('Password:', adminUser.password);
        console.log('\n⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Failed to create admin user:', error);
        process.exit(1);
    }
}

seedAdmin();

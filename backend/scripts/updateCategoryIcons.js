/**
 * updateCategoryIcons.js
 * Updates categories that still have the default icon with appropriate icons
 * 
 * Run: node scripts/updateCategoryIcons.js
 */
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import '../db/config.js';
import Category from '../models/Category.js';

const iconMap = {
    'drink':      { icon: 'fa-solid fa-wine-glass',      color: '#8B5CF6' },
    'drinks':     { icon: 'fa-solid fa-wine-glass',      color: '#8B5CF6' },
    'fruit':      { icon: 'fa-solid fa-apple-whole',     color: '#22C55E' },
    'fruits':     { icon: 'fa-solid fa-apple-whole',     color: '#22C55E' },
    'stationery': { icon: 'fa-solid fa-pen',             color: '#F59E0B' },
    'stationary': { icon: 'fa-solid fa-pen',             color: '#F59E0B' },
    'grocery':    { icon: 'fa-solid fa-basket-shopping', color: '#EF4444' },
    'groceries':  { icon: 'fa-solid fa-basket-shopping', color: '#EF4444' },
    'chip':       { icon: 'fa-solid fa-cookie',          color: '#F97316' },
    'chips':      { icon: 'fa-solid fa-cookie',          color: '#F97316' },
    'fastfood':   { icon: 'fa-solid fa-burger',          color: '#DC2626' },
    'fast food':  { icon: 'fa-solid fa-burger',          color: '#DC2626' },
    'wood':       { icon: 'fa-solid fa-tree',            color: '#854D0E' },
    'house':      { icon: 'fa-solid fa-house',           color: '#0EA5E9' },
};

async function updateIcons() {
    try {
        const categories = await Category.find();
        let updated = 0;

        for (const cat of categories) {
            const key = cat.name.toLowerCase();
            if (iconMap[key]) {
                cat.icon = iconMap[key].icon;
                cat.color = iconMap[key].color;
                await cat.save();
                console.log(`Updated: ${cat.name} → ${cat.icon} (${cat.color})`);
                updated++;
            }
        }

        console.log(`\nDone. Updated ${updated} of ${categories.length} categories.`);
        process.exit(0);
    } catch (error) {
        console.error('Update failed:', error);
        process.exit(1);
    }
}

updateIcons();

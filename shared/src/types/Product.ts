/**
 * Product Types
 * Shared TypeScript interface for Product entity
 */

import type { Category } from './Category';

/**
 * Product entity interface
 * Required fields: name, price, categoryId, company
 * Optional/Generated fields: _id, userId, createdAt, updatedAt
 */
export interface Product {
  _id?: string;
  name: string;
  price: string;
  categoryId: string;
  userId?: string;
  company: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Product with populated category (for responses)
 */
export interface ProductWithCategory extends Omit<Product, 'categoryId'> {
  category: Category;
}

/**
 * Category Types
 * Shared TypeScript interface for Category entity
 */

/**
 * Category entity interface
 * Required fields: name
 * Optional fields: description, icon, color
 * Generated fields: _id, createdAt, updatedAt
 */
export interface Category {
  _id?: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

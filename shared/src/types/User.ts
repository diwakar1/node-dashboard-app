/**
 * User Types
 * Shared TypeScript interface for User entity
 */

/**
 * User entity interface
 * Required fields: name, email, password (for registration/login)
 * Generated fields: _id, createdAt, updatedAt
 * Note: password should not be sent in responses
 */
export interface User {
  _id?: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Auth response with tokens and user data (without password)
 */
export interface AuthResponse {
  user: Omit<User, 'password'>;
  accessToken: string;
  refreshToken: string;
}

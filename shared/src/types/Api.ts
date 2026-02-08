/**
 * API Response Types
 * Shared TypeScript interfaces for API responses
 */

/**
 * Standard API success response
 */
export interface ApiResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standard API error response
 */
export interface ApiError {
  success: false;
  error: string;
  detail?: string;
  statusCode?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Dashboard stats response
 */
export interface DashboardStats {
  totalProducts: number;
  totalCategories: number;
  totalUsers?: number;
  recentProducts?: any[];
}

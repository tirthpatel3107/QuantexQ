/**
 * Common API Types
 * Shared types across all API services
 */

// Base API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// Error response structure
export interface ApiError {
  success: false;
  error: string;
  code?: string;
  details?: Record<string, unknown>;
}

// Pagination metadata
export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// Base query params
export interface BaseQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

// Save operation result
export interface SaveResult {
  success: boolean;
  message: string;
  updatedAt: string;
}

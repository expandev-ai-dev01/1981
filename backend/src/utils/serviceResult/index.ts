/**
 * @summary
 * Standardized service result helpers.
 * Provides consistent response structure for all services.
 *
 * @module utils/serviceResult
 */

/**
 * @interface ServiceResult
 * @description Standardized service response with success/error handling
 */
export interface ServiceResult<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  statusCode: number;
}

/**
 * Creates a success result
 * @template T - Type of the data
 * @param {T} data - The data to return
 * @param {number} statusCode - HTTP status code (default: 200)
 * @returns {ServiceResult<T>} Success result object
 */
export function successResult<T>(data: T, statusCode: number = 200): ServiceResult<T> {
  return { success: true, data, statusCode };
}

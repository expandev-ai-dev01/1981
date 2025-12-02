/**
 * @summary
 * Custom service error class for business logic errors.
 * Used by services to throw typed errors that controllers can handle.
 *
 * @module utils/serviceError
 */

/**
 * @class ServiceError
 * @extends Error
 * @description Custom error class for service layer errors
 */
export class ServiceError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(code: string, message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ServiceError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // Maintains proper stack trace for where error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Type guard to check if error is a ServiceError
 * @param {unknown} error - Error to check
 * @returns {boolean} True if error is ServiceError
 */
export function isServiceError(error: unknown): error is ServiceError {
  return error instanceof ServiceError;
}

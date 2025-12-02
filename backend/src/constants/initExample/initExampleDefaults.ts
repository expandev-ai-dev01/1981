/**
 * @summary
 * Default values and constants for InitExample entity.
 * Provides centralized configuration for entity creation, validation limits,
 * and priority level definitions.
 *
 * @module constants/initExample/initExampleDefaults
 */

/**
 * @interface InitExampleDefaultsType
 * @description Default configuration values applied when creating new InitExample entities.
 *
 * @property {boolean} ACTIVE - Default active status for new records (true)
 * @property {string} PRIORITY - Default priority level for new records ('medium')
 * @property {number} MAX_RECORDS - Maximum number of records allowed in memory storage (1000)
 */
export const INIT_EXAMPLE_DEFAULTS = {
  /** Default active status for new records */
  ACTIVE: true,
  /** Default priority for new records */
  PRIORITY: 'medium' as const,
  /** Maximum allowed records in memory */
  MAX_RECORDS: 1000,
} as const;

/** Type representing the INIT_EXAMPLE_DEFAULTS constant */
export type InitExampleDefaultsType = typeof INIT_EXAMPLE_DEFAULTS;

/**
 * @interface InitExamplePrioritiesType
 * @description Available priority levels for InitExample entities.
 *
 * @property {string} LOW - Low priority level ('low')
 * @property {string} MEDIUM - Medium priority level ('medium')
 * @property {string} HIGH - High priority level ('high')
 */
export const INIT_EXAMPLE_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

/** Type representing the INIT_EXAMPLE_PRIORITIES constant */
export type InitExamplePrioritiesType = typeof INIT_EXAMPLE_PRIORITIES;

/** Union type of all valid priority values */
export type InitExamplePriority =
  (typeof INIT_EXAMPLE_PRIORITIES)[keyof typeof INIT_EXAMPLE_PRIORITIES];

/**
 * @interface InitExampleLimitsType
 * @description Validation constraints for InitExample entity fields.
 *
 * @property {number} NAME_MIN_LENGTH - Minimum characters for name field (1)
 * @property {number} NAME_MAX_LENGTH - Maximum characters for name field (200)
 * @property {number} DESCRIPTION_MAX_LENGTH - Maximum characters for description field (500)
 * @property {number} CATEGORY_MIN_LENGTH - Minimum characters for category in metadata (1)
 * @property {number} CATEGORY_MAX_LENGTH - Maximum characters for category in metadata (100)
 */
export const INIT_EXAMPLE_LIMITS = {
  NAME_MIN_LENGTH: 1,
  NAME_MAX_LENGTH: 200,
  DESCRIPTION_MAX_LENGTH: 500,
  CATEGORY_MIN_LENGTH: 1,
  CATEGORY_MAX_LENGTH: 100,
} as const;

/** Type representing the INIT_EXAMPLE_LIMITS constant */
export type InitExampleLimitsType = typeof INIT_EXAMPLE_LIMITS;

/**
 * @summary
 * Validation schemas for InitExample entity.
 * Centralizes all Zod validation logic for the service.
 *
 * @module services/initExample/initExampleValidation
 */

import { z } from 'zod';
import { INIT_EXAMPLE_LIMITS, INIT_EXAMPLE_PRIORITIES } from '@/constants';

/**
 * Schema for metadata object validation
 */
export const metadataSchema = z.object({
  category: z
    .string()
    .min(INIT_EXAMPLE_LIMITS.CATEGORY_MIN_LENGTH)
    .max(INIT_EXAMPLE_LIMITS.CATEGORY_MAX_LENGTH),
  priority: z.enum([
    INIT_EXAMPLE_PRIORITIES.LOW,
    INIT_EXAMPLE_PRIORITIES.MEDIUM,
    INIT_EXAMPLE_PRIORITIES.HIGH,
  ]),
});

/**
 * Schema for create request validation
 */
export const createSchema = z.object({
  name: z
    .string()
    .min(INIT_EXAMPLE_LIMITS.NAME_MIN_LENGTH)
    .max(INIT_EXAMPLE_LIMITS.NAME_MAX_LENGTH),
  description: z.string().max(INIT_EXAMPLE_LIMITS.DESCRIPTION_MAX_LENGTH).nullable(),
  metadata: metadataSchema.optional(),
});

/**
 * Schema for update request validation
 */
export const updateSchema = z.object({
  name: z
    .string()
    .min(INIT_EXAMPLE_LIMITS.NAME_MIN_LENGTH)
    .max(INIT_EXAMPLE_LIMITS.NAME_MAX_LENGTH),
  description: z.string().max(INIT_EXAMPLE_LIMITS.DESCRIPTION_MAX_LENGTH).nullable(),
  active: z.boolean(),
  metadata: metadataSchema.optional(),
});

/**
 * Schema for ID parameter validation
 */
export const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

/**
 * Inferred types from schemas
 */
export type MetadataInput = z.infer<typeof metadataSchema>;
export type CreateInput = z.infer<typeof createSchema>;
export type UpdateInput = z.infer<typeof updateSchema>;
export type ParamsInput = z.infer<typeof paramsSchema>;

/**
 * @summary
 * Business logic for InitExample entity.
 * Handles CRUD operations using in-memory storage.
 * All validation and business logic is centralized here.
 *
 * @module services/initExample/initExampleService
 */

import { INIT_EXAMPLE_DEFAULTS } from '@/constants';
import { initExampleStore } from '@/instances';
import { ServiceError } from '@/utils';
import {
  InitExampleEntity,
  InitExampleListResponse,
  InitExampleMetadata,
} from './initExampleTypes';
import { createSchema, updateSchema, paramsSchema } from './initExampleValidation';

/**
 * Creates default metadata using constants
 * @returns {InitExampleMetadata} Default metadata object
 */
function createDefaultMetadata(): InitExampleMetadata {
  return {
    category: 'general',
    priority: INIT_EXAMPLE_DEFAULTS.PRIORITY,
  };
}

/**
 * @summary
 * Lists all init-examples from the in-memory store.
 *
 * @function initExampleList
 * @module services/initExample
 *
 * @returns {Promise<InitExampleListResponse[]>} List of init-example entities
 *
 * @example
 * const examples = await initExampleList();
 * // Returns: [{ id: 1, name: 'Example', active: true, dateCreated: '2025-01-01T00:00:00.000Z' }]
 */
export async function initExampleList(): Promise<InitExampleListResponse[]> {
  const records = initExampleStore.getAll();
  return records.map((e) => ({
    id: e.id,
    name: e.name,
    active: e.active,
    dateCreated: e.dateCreated,
  }));
}

/**
 * @summary
 * Creates a new init-example entity with validated data.
 *
 * @function initExampleCreate
 * @module services/initExample
 *
 * @param {unknown} body - Raw request body to validate against createSchema
 * @returns {Promise<InitExampleEntity>} The newly created init-example entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When body fails schema validation
 *
 * @example
 * const newEntity = await initExampleCreate({ name: 'Test', description: 'A test entity' });
 * // Returns: { id: 1, name: 'Test', description: 'A test entity', active: true, ... }
 */
export async function initExampleCreate(body: unknown): Promise<InitExampleEntity> {
  const validation = createSchema.safeParse(body);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Validation failed', 400, validation.error.errors);
  }

  const params = validation.data;
  const now = new Date().toISOString();
  const id = initExampleStore.getNextId();

  const newExample: InitExampleEntity = {
    id,
    name: params.name,
    description: params.description,
    active: INIT_EXAMPLE_DEFAULTS.ACTIVE,
    metadata: params.metadata ?? createDefaultMetadata(),
    dateCreated: now,
    dateModified: now,
  };

  initExampleStore.add(newExample);
  return newExample;
}

/**
 * @summary
 * Retrieves a specific init-example by its unique identifier.
 *
 * @function initExampleGet
 * @module services/initExample
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @returns {Promise<InitExampleEntity>} The found init-example entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const entity = await initExampleGet({ id: '1' });
 * // Returns: { id: 1, name: 'Example', ... }
 */
export async function initExampleGet(params: unknown): Promise<InitExampleEntity> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;
  const record = initExampleStore.getById(id);

  if (!record) {
    throw new ServiceError('NOT_FOUND', 'Not found', 404);
  }

  return record as InitExampleEntity;
}

/**
 * @summary
 * Updates an existing init-example entity with new data.
 *
 * @function initExampleUpdate
 * @module services/initExample
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @param {unknown} body - Raw request body with update data to validate
 * @returns {Promise<InitExampleEntity>} The updated init-example entity
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID or body fails validation
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const updated = await initExampleUpdate({ id: '1' }, { name: 'Updated Name', active: false });
 * // Returns: { id: 1, name: 'Updated Name', active: false, ... }
 */
export async function initExampleUpdate(
  params: unknown,
  body: unknown
): Promise<InitExampleEntity> {
  const paramsValidation = paramsSchema.safeParse(params);

  if (!paramsValidation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, paramsValidation.error.errors);
  }

  const bodyValidation = updateSchema.safeParse(body);

  if (!bodyValidation.success) {
    throw new ServiceError(
      'VALIDATION_ERROR',
      'Validation failed',
      400,
      bodyValidation.error.errors
    );
  }

  const { id } = paramsValidation.data;
  const existing = initExampleStore.getById(id);

  if (!existing) {
    throw new ServiceError('NOT_FOUND', 'Not found', 404);
  }

  const updateData = bodyValidation.data;
  const updated = initExampleStore.update(id, {
    name: updateData.name,
    description: updateData.description,
    active: updateData.active,
    metadata: updateData.metadata ?? existing.metadata,
    dateModified: new Date().toISOString(),
  });

  return updated as InitExampleEntity;
}

/**
 * @summary
 * Permanently deletes an init-example entity by its ID.
 *
 * @function initExampleDelete
 * @module services/initExample
 *
 * @param {unknown} params - Raw request params containing the ID to validate
 * @returns {Promise<{ message: string }>} Success confirmation message
 *
 * @throws {ServiceError} VALIDATION_ERROR (400) - When ID parameter is invalid
 * @throws {ServiceError} NOT_FOUND (404) - When entity with given ID does not exist
 *
 * @example
 * const result = await initExampleDelete({ id: '1' });
 * // Returns: { message: 'Deleted successfully' }
 */
export async function initExampleDelete(params: unknown): Promise<{ message: string }> {
  const validation = paramsSchema.safeParse(params);

  if (!validation.success) {
    throw new ServiceError('VALIDATION_ERROR', 'Invalid ID', 400, validation.error.errors);
  }

  const { id } = validation.data;

  if (!initExampleStore.exists(id)) {
    throw new ServiceError('NOT_FOUND', 'Not found', 404);
  }

  initExampleStore.delete(id);
  return { message: 'Deleted successfully' };
}

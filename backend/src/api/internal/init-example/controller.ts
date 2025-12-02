/**
 * @summary
 * API controller for InitExample entity.
 * Thin layer that delegates all logic to service.
 *
 * @module api/internal/init-example/controller
 */

import { Request, Response, NextFunction } from 'express';
import { successResponse, errorResponse, isServiceError } from '@/utils';
import {
  initExampleCreate,
  initExampleList,
  initExampleGet,
  initExampleUpdate,
  initExampleDelete,
} from '@/services/initExample';

/**
 * @api {get} /api/internal/init-example List Init-Examples
 * @apiName ListInitExamples
 * @apiGroup InitExample
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Object[]} data List of init-examples
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.name Name
 * @apiSuccess {Boolean} data.active Active status
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 */
export async function listHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await initExampleList();
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {post} /api/internal/init-example Create Init-Example
 * @apiName CreateInitExample
 * @apiGroup InitExample
 *
 * @apiBody {String} name Name (1-200 chars)
 * @apiBody {String|null} description Description (max 500 chars)
 * @apiBody {Object} [metadata] Optional metadata
 * @apiBody {String} metadata.category Category (1-100 chars)
 * @apiBody {String} metadata.priority Priority (low | medium | high)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.name Name
 * @apiSuccess {String|null} data.description Description
 * @apiSuccess {Boolean} data.active Active status
 * @apiSuccess {String} data.metadata.category Category
 * @apiSuccess {String} data.metadata.priority Priority (low | medium | high)
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 * @apiSuccess {String} data.dateModified ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function createHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await initExampleCreate(req.body);
    res.status(201).json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {get} /api/internal/init-example/:id Get Init-Example
 * @apiName GetInitExample
 * @apiGroup InitExample
 *
 * @apiParam {Number} id Init-example ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.name Name
 * @apiSuccess {String|null} data.description Description
 * @apiSuccess {Boolean} data.active Active status
 * @apiSuccess {String} data.metadata.category Category
 * @apiSuccess {String} data.metadata.priority Priority (low | medium | high)
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 * @apiSuccess {String} data.dateModified ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function getHandler(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await initExampleGet(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {put} /api/internal/init-example/:id Update Init-Example
 * @apiName UpdateInitExample
 * @apiGroup InitExample
 *
 * @apiParam {Number} id Init-example ID
 *
 * @apiBody {String} name Name (1-200 chars)
 * @apiBody {String|null} description Description (max 500 chars)
 * @apiBody {Boolean} active Active status
 * @apiBody {Object} [metadata] Optional metadata
 * @apiBody {String} metadata.category Category (1-100 chars)
 * @apiBody {String} metadata.priority Priority (low | medium | high)
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {Number} data.id Unique identifier
 * @apiSuccess {String} data.name Name
 * @apiSuccess {String|null} data.description Description
 * @apiSuccess {Boolean} data.active Active status
 * @apiSuccess {String} data.metadata.category Category
 * @apiSuccess {String} data.metadata.priority Priority (low | medium | high)
 * @apiSuccess {String} data.dateCreated ISO 8601 timestamp
 * @apiSuccess {String} data.dateModified ISO 8601 timestamp
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function updateHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await initExampleUpdate(req.params, req.body);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

/**
 * @api {delete} /api/internal/init-example/:id Delete Init-Example
 * @apiName DeleteInitExample
 * @apiGroup InitExample
 *
 * @apiParam {Number} id Init-example ID
 *
 * @apiSuccess {Boolean} success Success flag (always true)
 * @apiSuccess {String} data.message Confirmation message
 *
 * @apiError {Boolean} success Success flag (always false)
 * @apiError {String} error.code Error code (NOT_FOUND | VALIDATION_ERROR)
 * @apiError {String} error.message Error message
 */
export async function deleteHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = await initExampleDelete(req.params);
    res.json(successResponse(data));
  } catch (error) {
    if (isServiceError(error)) {
      res.status(error.statusCode).json(errorResponse(error.message, error.code, error.details));
      return;
    }
    next(error);
  }
}

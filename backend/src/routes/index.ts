/**
 * @summary
 * Main API router configuration.
 * Routes requests to external (public) and internal (authenticated) endpoints.
 *
 * @module routes
 */

import { Router } from 'express';
import externalRoutes from './externalRoutes';
import internalRoutes from './internalRoutes';

const router = Router();

/**
 * @rule {be-route-configuration}
 * External (public) routes - /api/external/...
 */
router.use('/external', externalRoutes);

/**
 * @rule {be-route-configuration}
 * Internal (authenticated) routes - /api/internal/...
 */
router.use('/internal', internalRoutes);

export default router;

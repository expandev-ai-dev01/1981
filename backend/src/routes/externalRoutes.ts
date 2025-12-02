/**
 * @summary
 * External API routes configuration.
 * Handles public endpoints that don't require authentication.
 *
 * @module routes/externalRoutes
 */

import { Router } from 'express';

const router = Router();

/**
 * @rule {be-route-configuration}
 * External routes will be added here as features are implemented.
 * Example:
 * router.use('/security', securityRoutes);
 * router.use('/public', publicRoutes);
 */

export default router;

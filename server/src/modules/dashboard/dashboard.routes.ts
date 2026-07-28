import { Router } from 'express';
import { requireAuth } from '../../middleware/auth.middleware.js';
import * as dashboardController from './dashboard.controller.js';

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth);

dashboardRoutes.get('/stats', dashboardController.statsHandler);
dashboardRoutes.get('/charts/daily-locations', dashboardController.dailyLocationsChartHandler);
dashboardRoutes.get('/charts/top-countries', dashboardController.topCountriesChartHandler);
dashboardRoutes.get('/charts/acceptance-rate', dashboardController.acceptanceRateChartHandler);
dashboardRoutes.get('/charts/active-links', dashboardController.activeLinksChartHandler);
dashboardRoutes.get('/activity', dashboardController.activityFeedHandler);

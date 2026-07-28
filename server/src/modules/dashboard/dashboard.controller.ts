import type { Request, Response } from 'express';
import * as dashboardService from './dashboard.service.js';

export async function statsHandler(req: Request, res: Response) {
  res.json(await dashboardService.getStats(req.user!.id));
}

export async function dailyLocationsChartHandler(req: Request, res: Response) {
  res.json({ items: await dashboardService.getDailyLocationsChart(req.user!.id) });
}

export async function topCountriesChartHandler(req: Request, res: Response) {
  res.json({ items: await dashboardService.getTopCountriesChart(req.user!.id) });
}

export async function acceptanceRateChartHandler(req: Request, res: Response) {
  res.json(await dashboardService.getAcceptanceRateChart(req.user!.id));
}

export async function activeLinksChartHandler(req: Request, res: Response) {
  res.json({ items: await dashboardService.getActiveLinksChart(req.user!.id) });
}

export async function activityFeedHandler(req: Request, res: Response) {
  res.json({ items: await dashboardService.getActivityFeed(req.user!.id) });
}

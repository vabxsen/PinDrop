import type { Request, Response } from 'express';
import { stringify } from 'csv-stringify';
import type { ListLocationsQuery } from '@pindrop/shared';
import * as locationsService from './locations.service.js';

const CSV_COLUMNS = [
  { key: 'createdAt', header: 'Timestamp' },
  { key: 'linkTitle', header: 'Link' },
  { key: 'permissionStatus', header: 'Permission' },
  { key: 'lat', header: 'Latitude' },
  { key: 'lng', header: 'Longitude' },
  { key: 'accuracy', header: 'Accuracy (m)' },
  { key: 'displayAddress', header: 'Address' },
  { key: 'city', header: 'City' },
  { key: 'state', header: 'State' },
  { key: 'country', header: 'Country' },
  { key: 'postalCode', header: 'Postal Code' },
  { key: 'browser', header: 'Browser' },
  { key: 'os', header: 'OS' },
  { key: 'deviceType', header: 'Device Type' },
  { key: 'timezone', header: 'Timezone' },
];

export async function listLocationsHandler(req: Request, res: Response) {
  const query = req.validated.query as ListLocationsQuery;
  const result = await locationsService.listLocations(req.user!.id, query);
  res.json(result);
}

export async function deleteLocationHandler(req: Request, res: Response) {
  const { id } = req.validated.params as { id: string };
  await locationsService.deleteLocation(req.user!.id, id);
  res.status(204).send();
}

export async function exportLocationsCsvHandler(req: Request, res: Response) {
  const query = req.validated.query as Pick<ListLocationsQuery, 'linkId' | 'search'>;

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="pindrop-locations.csv"');

  const stringifier = stringify({ header: true, columns: CSV_COLUMNS });
  stringifier.pipe(res);

  try {
    for await (const record of locationsService.iterateLocationsForExport(req.user!.id, query)) {
      stringifier.write(record);
    }
    stringifier.end();
  } catch (err) {
    stringifier.destroy(err as Error);
  }
}

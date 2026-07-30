import { useEffect } from 'react';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { EmptyState } from '@/components/ui/EmptyState';

const TILE_URL = import.meta.env.VITE_MAP_TILE_URL as string;
const TILE_ATTRIBUTION = import.meta.env.VITE_MAP_ATTRIBUTION as string;

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  label: string;
  subLabel?: string;
}

function FitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    const first = points[0];
    if (points.length === 1 && first) {
      map.setView([first.lat, first.lng], 13);
      return;
    }
    map.fitBounds(
      points.map((p) => [p.lat, p.lng]),
      { padding: [32, 32], maxZoom: 15 },
    );
  }, [points, map]);

  return null;
}

export function LocationsMap({ points, height = 360 }: { points: MapPoint[]; height?: number }) {
  if (points.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800"
        style={{ height }}
      >
        <EmptyState
          title="No locations yet"
          description="Granted locations will appear here on the map."
        />
      </div>
    );
  }

  const first = points[0]!;

  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800"
      style={{ height }}
    >
      <MapContainer
        center={[first.lat, first.lng]}
        zoom={12}
        scrollWheelZoom
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
        <FitBounds points={points} />
        {points.map((point) => (
          <CircleMarker
            key={point.id}
            center={[point.lat, point.lng]}
            radius={8}
            pathOptions={{ color: '#ffffff', weight: 2, fillColor: '#5330f0', fillOpacity: 1 }}
          >
            <Popup>
              <p className="font-medium">{point.label}</p>
              {point.subLabel && <p className="text-slate-500">{point.subLabel}</p>}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block font-medium text-brand-600 hover:underline"
              >
                Open in Google Maps
              </a>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}

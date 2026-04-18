import { Injectable } from '@nestjs/common';

export type ElevationLocation = {
  lat: number;
  lng: number;
};

type ElevationPoint = ElevationLocation & {
  elevation: number | null;
};

type OpenTopoDataResponse = {
  status: string;
  results: Array<{
    elevation: number | null;
    location: ElevationLocation;
  }>;
};

const DEFAULT_OPEN_TOPO_DATA_URL = 'https://api.opentopodata.org/v1/srtm30m';
const MAX_LOCATIONS_PER_REQUEST = 100;

const elevationCache = new Map<string, number>();
let queueChain: Promise<void> = Promise.resolve();

function cacheKey(lat: number, lng: number): string {
  return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}

async function queuedFetch(url: string): Promise<OpenTopoDataResponse> {
  return new Promise<OpenTopoDataResponse>((resolve, reject) => {
    queueChain = queueChain.then(async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`OpenTopoData API error: ${response.status} ${response.statusText}`);
        }

        const payload = (await response.json()) as OpenTopoDataResponse;
        if (payload.status !== 'OK') {
          throw new Error(`OpenTopoData returned status: ${payload.status}`);
        }

        resolve(payload);
      } catch (error) {
        reject(error);
      }

      await new Promise((resolveDelay) => setTimeout(resolveDelay, 1200));
    });
  });
}

@Injectable()
export class ElevationService {
  async fetchBatch(locations: ElevationLocation[]): Promise<ElevationPoint[]> {
    const normalizedLocations = locations.filter(
      (location) => Number.isFinite(location.lat) && Number.isFinite(location.lng),
    );

    const results: ElevationPoint[] = normalizedLocations.map((location) => ({
      lat: location.lat,
      lng: location.lng,
      elevation: elevationCache.get(cacheKey(location.lat, location.lng)) ?? null,
    }));

    const uncached: Array<ElevationLocation & { index: number }> = [];
    normalizedLocations.forEach((location, index) => {
      if (!elevationCache.has(cacheKey(location.lat, location.lng))) {
        uncached.push({ ...location, index });
      }
    });

    if (uncached.length === 0) {
      return results;
    }

    const batches: typeof uncached[] = [];
    for (let index = 0; index < uncached.length; index += MAX_LOCATIONS_PER_REQUEST) {
      batches.push(uncached.slice(index, index + MAX_LOCATIONS_PER_REQUEST));
    }

    const opentopodataUrl = process.env.OPEN_TOPO_DATA_URL?.trim() || DEFAULT_OPEN_TOPO_DATA_URL;

    for (const batch of batches) {
      const locString = batch.map((location) => `${location.lat},${location.lng}`).join('|');
      const url = `${opentopodataUrl}?locations=${locString}&interpolation=bilinear`;
      const payload = await queuedFetch(url);

      payload.results.forEach((result, resultIndex) => {
        const original = batch[resultIndex];
        const elevation = result.elevation;

        results[original.index].elevation = elevation;
        if (elevation !== null) {
          elevationCache.set(cacheKey(original.lat, original.lng), elevation);
        }
      });
    }

    return results;
  }
}
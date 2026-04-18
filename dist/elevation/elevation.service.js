"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ElevationService = void 0;
const common_1 = require("@nestjs/common");
const DEFAULT_OPEN_TOPO_DATA_URL = 'https://api.opentopodata.org/v1/srtm30m';
const MAX_LOCATIONS_PER_REQUEST = 100;
const elevationCache = new Map();
let queueChain = Promise.resolve();
function cacheKey(lat, lng) {
    return `${lat.toFixed(4)},${lng.toFixed(4)}`;
}
async function queuedFetch(url) {
    return new Promise((resolve, reject) => {
        queueChain = queueChain.then(async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`OpenTopoData API error: ${response.status} ${response.statusText}`);
                }
                const payload = (await response.json());
                if (payload.status !== 'OK') {
                    throw new Error(`OpenTopoData returned status: ${payload.status}`);
                }
                resolve(payload);
            }
            catch (error) {
                reject(error);
            }
            await new Promise((resolveDelay) => setTimeout(resolveDelay, 1200));
        });
    });
}
let ElevationService = class ElevationService {
    async fetchBatch(locations) {
        const normalizedLocations = locations.filter((location) => Number.isFinite(location.lat) && Number.isFinite(location.lng));
        const results = normalizedLocations.map((location) => ({
            lat: location.lat,
            lng: location.lng,
            elevation: elevationCache.get(cacheKey(location.lat, location.lng)) ?? null,
        }));
        const uncached = [];
        normalizedLocations.forEach((location, index) => {
            if (!elevationCache.has(cacheKey(location.lat, location.lng))) {
                uncached.push({ ...location, index });
            }
        });
        if (uncached.length === 0) {
            return results;
        }
        const batches = [];
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
};
exports.ElevationService = ElevationService;
exports.ElevationService = ElevationService = __decorate([
    (0, common_1.Injectable)()
], ElevationService);
//# sourceMappingURL=elevation.service.js.map
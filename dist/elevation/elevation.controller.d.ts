import { ElevationService, ElevationLocation } from './elevation.service';
type ElevationBatchRequest = {
    locations: ElevationLocation[];
};
export declare class ElevationController {
    private readonly elevationService;
    constructor(elevationService: ElevationService);
    fetchBatch(body: ElevationBatchRequest): Promise<(ElevationLocation & {
        elevation: number | null;
    })[]>;
}
export {};

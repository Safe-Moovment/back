export type ElevationLocation = {
    lat: number;
    lng: number;
};
type ElevationPoint = ElevationLocation & {
    elevation: number | null;
};
export declare class ElevationService {
    fetchBatch(locations: ElevationLocation[]): Promise<ElevationPoint[]>;
}
export {};

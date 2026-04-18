import { Model } from 'mongoose';
import { Fence } from './schemas/fence.schema';
type FenceStatus = 'active' | 'inactive';
type FenceView = {
    id: string;
    name: string;
    area: string;
    animals: number;
    status: FenceStatus;
    violations: number;
    color: string;
    coordinates: [number, number][];
};
type FenceUpsertPayload = Partial<FenceView>;
export declare class FencesService {
    private readonly fenceModel;
    constructor(fenceModel: Model<Fence>);
    list(): Promise<FenceView[]>;
    create(payload: FenceUpsertPayload): Promise<FenceView>;
    update(id: string, payload: FenceUpsertPayload): Promise<FenceView>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    private toView;
    private buildFenceRecord;
    private requireString;
    private requireNumber;
    private requireStatus;
    private requireCoordinates;
}
export {};

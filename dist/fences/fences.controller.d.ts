import { FencesService } from './fences.service';
type FenceView = {
    id: string;
    name: string;
    area: string;
    animals: number;
    status: 'active' | 'inactive';
    violations: number;
    color: string;
    coordinates: [number, number][];
};
export declare class FencesController {
    private readonly fencesService;
    constructor(fencesService: FencesService);
    list(): Promise<FenceView[]>;
    create(payload: Partial<FenceView>): Promise<FenceView>;
    update(id: string, payload: Partial<Omit<FenceView, 'id'>>): Promise<FenceView>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}
export {};

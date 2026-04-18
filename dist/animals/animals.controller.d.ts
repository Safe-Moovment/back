import { AnimalsService } from './animals.service';
type AnimalView = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    health: 'Excelente' | 'Buena' | 'Atención' | 'Alerta';
    battery: number;
    temp: number;
    lastUpdate: string;
    status: 'ok' | 'alert';
    locationText: string;
};
export declare class AnimalsController {
    private readonly animalsService;
    constructor(animalsService: AnimalsService);
    list(): AnimalView[];
    create(payload: Partial<AnimalView>): AnimalView;
    update(id: string, payload: Partial<Omit<AnimalView, 'id'>>): AnimalView;
}
export {};

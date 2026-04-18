import { Model } from 'mongoose';
import { Animal } from './schemas/animal.schema';
type AnimalHealth = 'Excelente' | 'Buena' | 'Atención' | 'Alerta';
type AnimalStatus = 'ok' | 'alert';
type AnimalView = {
    id: string;
    name: string;
    lat: number;
    lng: number;
    health: AnimalHealth;
    battery: number;
    temp: number;
    lastUpdate: string;
    status: AnimalStatus;
    locationText: string;
};
type AnimalUpsertPayload = Partial<AnimalView>;
export declare class AnimalsService {
    private readonly animalModel;
    constructor(animalModel: Model<Animal>);
    list(): Promise<AnimalView[]>;
    create(payload: AnimalUpsertPayload): Promise<AnimalView>;
    update(id: string, payload: AnimalUpsertPayload): Promise<AnimalView>;
    private toView;
    private buildAnimalRecord;
    private requireString;
    private requireNumber;
    private requireDate;
    private requireHealth;
    private requireStatus;
}
export {};

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
    private readonly animals;
    list(): AnimalView[];
    create(payload: AnimalUpsertPayload): AnimalView;
    update(id: string, payload: AnimalUpsertPayload): AnimalView;
    private toAnimal;
    private requireString;
    private requireNumber;
    private requireHealth;
    private requireStatus;
}
export {};

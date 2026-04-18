import { HydratedDocument } from 'mongoose';
export type AnimalDocument = HydratedDocument<Animal>;
export declare class Animal {
    id: string;
    name: string;
    lat: number;
    lng: number;
    health: 'Excelente' | 'Buena' | 'Atención' | 'Alerta';
    battery: number;
    temp: number;
    lastUpdate: Date;
    status: 'ok' | 'alert';
    locationText: string;
}
export declare const AnimalSchema: import("mongoose").Schema<Animal, import("mongoose").Model<Animal, any, any, any, any, any, Animal>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {
    id?: import("mongoose").SchemaDefinitionProperty<string, Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    lat?: import("mongoose").SchemaDefinitionProperty<number, Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    lng?: import("mongoose").SchemaDefinitionProperty<number, Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    health?: import("mongoose").SchemaDefinitionProperty<"Excelente" | "Buena" | "Atención" | "Alerta", Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    battery?: import("mongoose").SchemaDefinitionProperty<number, Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    temp?: import("mongoose").SchemaDefinitionProperty<number, Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    lastUpdate?: import("mongoose").SchemaDefinitionProperty<Date, Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"ok" | "alert", Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    locationText?: import("mongoose").SchemaDefinitionProperty<string, Animal, import("mongoose").Document<unknown, {}, Animal, {}, import("mongoose").DefaultSchemaOptions> & Animal & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
}, Animal>;

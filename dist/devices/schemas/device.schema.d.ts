import { HydratedDocument } from 'mongoose';
export type DeviceDocument = HydratedDocument<Device>;
export declare class Device {
    id: string;
    animalId: string;
    battery: number;
    signal: number;
    status: 'active' | 'warning' | 'critical';
    lastPing: Date;
    hardwareVersion: string;
    solarCharging: boolean;
    protocol: 'LoRaWAN' | 'LTE' | 'NB-IoT';
    lastSyncMode: 'Store & Forward' | 'Real-time';
    gatewayId: string;
    alertsCount: number;
}
export declare const DeviceSchema: import("mongoose").Schema<Device, import("mongoose").Model<Device, any, any, any, any, any, Device>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {
    id?: import("mongoose").SchemaDefinitionProperty<string, Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    animalId?: import("mongoose").SchemaDefinitionProperty<string, Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    battery?: import("mongoose").SchemaDefinitionProperty<number, Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    signal?: import("mongoose").SchemaDefinitionProperty<number, Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"critical" | "warning" | "active", Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    lastPing?: import("mongoose").SchemaDefinitionProperty<Date, Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    hardwareVersion?: import("mongoose").SchemaDefinitionProperty<string, Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    solarCharging?: import("mongoose").SchemaDefinitionProperty<boolean, Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    protocol?: import("mongoose").SchemaDefinitionProperty<"LoRaWAN" | "LTE" | "NB-IoT", Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    lastSyncMode?: import("mongoose").SchemaDefinitionProperty<"Store & Forward" | "Real-time", Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    gatewayId?: import("mongoose").SchemaDefinitionProperty<string, Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    alertsCount?: import("mongoose").SchemaDefinitionProperty<number, Device, import("mongoose").Document<unknown, {}, Device, {}, import("mongoose").DefaultSchemaOptions> & Device & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
}, Device>;

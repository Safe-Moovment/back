import { HydratedDocument } from 'mongoose';
export type FenceDocument = HydratedDocument<Fence>;
export declare class Fence {
    id: string;
    name: string;
    area: string;
    animals: number;
    status: 'active' | 'inactive';
    violations: number;
    color: string;
    coordinates: [number, number][];
}
export declare const FenceSchema: import("mongoose").Schema<Fence, import("mongoose").Model<Fence, any, any, any, any, any, Fence>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Fence, import("mongoose").Document<unknown, {}, Fence, {}, import("mongoose").DefaultSchemaOptions> & Fence & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, {
    id?: import("mongoose").SchemaDefinitionProperty<string, Fence, import("mongoose").Document<unknown, {}, Fence, {}, import("mongoose").DefaultSchemaOptions> & Fence & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Fence, import("mongoose").Document<unknown, {}, Fence, {}, import("mongoose").DefaultSchemaOptions> & Fence & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    area?: import("mongoose").SchemaDefinitionProperty<string, Fence, import("mongoose").Document<unknown, {}, Fence, {}, import("mongoose").DefaultSchemaOptions> & Fence & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    animals?: import("mongoose").SchemaDefinitionProperty<number, Fence, import("mongoose").Document<unknown, {}, Fence, {}, import("mongoose").DefaultSchemaOptions> & Fence & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"active" | "inactive", Fence, import("mongoose").Document<unknown, {}, Fence, {}, import("mongoose").DefaultSchemaOptions> & Fence & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    violations?: import("mongoose").SchemaDefinitionProperty<number, Fence, import("mongoose").Document<unknown, {}, Fence, {}, import("mongoose").DefaultSchemaOptions> & Fence & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    color?: import("mongoose").SchemaDefinitionProperty<string, Fence, import("mongoose").Document<unknown, {}, Fence, {}, import("mongoose").DefaultSchemaOptions> & Fence & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
    coordinates?: import("mongoose").SchemaDefinitionProperty<[number, number][], Fence, import("mongoose").Document<unknown, {}, Fence, {}, import("mongoose").DefaultSchemaOptions> & Fence & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }> | undefined;
}, Fence>;

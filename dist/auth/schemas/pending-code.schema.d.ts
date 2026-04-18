import { HydratedDocument } from 'mongoose';
export type PendingCodeDocument = HydratedDocument<PendingCode>;
export declare class PendingCode {
    email: string;
    codeHash: string;
    expiresAt: Date;
    issuedAt: Date;
    verifiedAt?: Date | null;
    usedAt?: Date | null;
    status: 'pending' | 'verified' | 'used' | 'expired';
    purpose: 'registration' | 'reset';
}
export declare const PendingCodeSchema: import("mongoose").Schema<PendingCode, import("mongoose").Model<PendingCode, any, any, any, any, any, PendingCode>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, PendingCode, import("mongoose").Document<unknown, {}, PendingCode, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<PendingCode & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, "id"> & {
    id: string;
}, {
    email?: import("mongoose").SchemaDefinitionProperty<string, PendingCode, import("mongoose").Document<unknown, {}, PendingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PendingCode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    codeHash?: import("mongoose").SchemaDefinitionProperty<string, PendingCode, import("mongoose").Document<unknown, {}, PendingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PendingCode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    expiresAt?: import("mongoose").SchemaDefinitionProperty<Date, PendingCode, import("mongoose").Document<unknown, {}, PendingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PendingCode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    issuedAt?: import("mongoose").SchemaDefinitionProperty<Date, PendingCode, import("mongoose").Document<unknown, {}, PendingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PendingCode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    verifiedAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, PendingCode, import("mongoose").Document<unknown, {}, PendingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PendingCode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    usedAt?: import("mongoose").SchemaDefinitionProperty<Date | null | undefined, PendingCode, import("mongoose").Document<unknown, {}, PendingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PendingCode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<"pending" | "verified" | "used" | "expired", PendingCode, import("mongoose").Document<unknown, {}, PendingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PendingCode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
    purpose?: import("mongoose").SchemaDefinitionProperty<"registration" | "reset", PendingCode, import("mongoose").Document<unknown, {}, PendingCode, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<PendingCode & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & {
        id: string;
    }> | undefined;
}, PendingCode>;

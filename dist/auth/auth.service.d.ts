import { Model } from 'mongoose';
import { PendingCode } from './schemas/pending-code.schema';
import { User } from './schemas/user.schema';
export declare class AuthService {
    private readonly userModel;
    private readonly pendingCodeModel;
    private readonly logger;
    constructor(userModel: Model<User>, pendingCodeModel: Model<PendingCode>);
    startRegistration(email?: string): Promise<{
        message: string;
        email: string;
    }>;
    verifyRegistrationCode(email?: string, code?: string): Promise<{
        message: string;
        email: string;
        verified: boolean;
    }>;
    completeRegistration(email?: string, password?: string): Promise<{
        message: string;
        email: string;
    }>;
    login(email?: string, password?: string): Promise<{
        message: string;
        email: string;
    }>;
    requestPasswordReset(email?: string): Promise<{
        message: string;
        email: string;
    }>;
    confirmPasswordReset(email?: string, code?: string, password?: string): Promise<{
        message: string;
        email: string;
    }>;
    private normalizeEmail;
    private generateVerificationCode;
    private hashValue;
    private verifyValue;
    private getPendingCodeOrThrow;
    private isCodeExpired;
    private markCodeAsUsed;
    private markCodeAsExpired;
    private isPasswordTooShort;
    private sendVerificationEmail;
    private createTransporterOrThrow;
    private parsePort;
    private parseBoolean;
    private normalizeAppPassword;
}

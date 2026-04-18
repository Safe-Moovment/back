import { AuthService } from './auth.service';
type RegisterStartBody = {
    email?: string;
};
type RegisterVerifyBody = {
    email?: string;
    code?: string;
};
type RegisterCompleteBody = {
    email?: string;
    password?: string;
};
type LoginBody = {
    email?: string;
    password?: string;
};
type ResetRequestBody = {
    email?: string;
};
type ResetConfirmBody = {
    email?: string;
    code?: string;
    password?: string;
};
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    startRegister(body: RegisterStartBody): Promise<{
        message: string;
        email: string;
    }>;
    verifyRegister(body: RegisterVerifyBody): Promise<{
        message: string;
        email: string;
        verified: boolean;
    }>;
    completeRegister(body: RegisterCompleteBody): Promise<{
        message: string;
        email: string;
    }>;
    login(body: LoginBody): Promise<{
        message: string;
        email: string;
    }>;
    requestReset(body: ResetRequestBody): Promise<{
        message: string;
        email: string;
    }>;
    confirmReset(body: ResetConfirmBody): Promise<{
        message: string;
        email: string;
    }>;
}
export {};

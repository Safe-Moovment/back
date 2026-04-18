"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const node_crypto_1 = require("node:crypto");
const node_util_1 = require("node:util");
const nodemailer_1 = __importDefault(require("nodemailer"));
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const pending_code_schema_1 = require("./schemas/pending-code.schema");
const user_schema_1 = require("./schemas/user.schema");
const scrypt = (0, node_util_1.promisify)(node_crypto_1.scrypt);
const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;
const VERIFICATION_CODE_LENGTH = 6;
const MIN_PASSWORD_LENGTH = 6;
let AuthService = AuthService_1 = class AuthService {
    userModel;
    pendingCodeModel;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(userModel, pendingCodeModel) {
        this.userModel = userModel;
        this.pendingCodeModel = pendingCodeModel;
    }
    async startRegistration(email) {
        const normalizedEmail = this.normalizeEmail(email);
        if (await this.userModel.exists({ email: normalizedEmail })) {
            throw new common_1.ConflictException('Ese correo ya tiene una cuenta creada.');
        }
        const code = this.generateVerificationCode();
        await this.pendingCodeModel.findOneAndUpdate({ email: normalizedEmail }, {
            email: normalizedEmail,
            codeHash: await this.hashValue(code),
            expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
            issuedAt: new Date(),
            purpose: 'registration',
            verifiedAt: null,
            usedAt: null,
            status: 'pending',
        }, { upsert: true, new: true });
        await this.sendVerificationEmail(normalizedEmail, code, 'registro');
        return {
            message: 'Codigo de verificacion enviado al correo.',
            email: normalizedEmail,
        };
    }
    async verifyRegistrationCode(email, code) {
        const normalizedEmail = this.normalizeEmail(email);
        const pendingCode = await this.getPendingCodeOrThrow(normalizedEmail, 'registration');
        if (this.isCodeExpired(pendingCode)) {
            await this.markCodeAsExpired(pendingCode);
            throw new common_1.UnauthorizedException('El codigo de verificacion expiro.');
        }
        if (!(await this.verifyValue(code, pendingCode.codeHash))) {
            throw new common_1.UnauthorizedException('El codigo de verificacion no es valido.');
        }
        pendingCode.verifiedAt = new Date();
        pendingCode.status = 'verified';
        await pendingCode.save();
        return {
            message: 'Correo verificado. Ahora puedes enviar la contrasena.',
            email: normalizedEmail,
            verified: true,
        };
    }
    async completeRegistration(email, password) {
        const normalizedEmail = this.normalizeEmail(email);
        const pendingCode = await this.getPendingCodeOrThrow(normalizedEmail, 'registration');
        if (await this.userModel.exists({ email: normalizedEmail })) {
            throw new common_1.ConflictException('Ese correo ya tiene una cuenta creada.');
        }
        if (this.isCodeExpired(pendingCode)) {
            await this.markCodeAsExpired(pendingCode);
            throw new common_1.UnauthorizedException('El codigo de verificacion expiro.');
        }
        if (!pendingCode.verifiedAt) {
            throw new common_1.BadRequestException('Primero debes validar el codigo de verificacion.');
        }
        if (this.isPasswordTooShort(password)) {
            throw new common_1.BadRequestException('La contrasena debe tener al menos 6 caracteres.');
        }
        const passwordHash = await this.hashValue(password ?? '');
        const now = new Date();
        await this.userModel.create({
            email: normalizedEmail,
            passwordHash,
            createdAt: now,
            updatedAt: now,
        });
        await this.markCodeAsUsed(pendingCode);
        return {
            message: 'Cuenta creada correctamente.',
            email: normalizedEmail,
        };
    }
    async login(email, password) {
        const normalizedEmail = this.normalizeEmail(email);
        const user = await this.userModel.findOne({ email: normalizedEmail });
        if (!user) {
            throw new common_1.UnauthorizedException('Correo o contrasena incorrectos.');
        }
        if (!(await this.verifyValue(password, user.passwordHash))) {
            throw new common_1.UnauthorizedException('Correo o contrasena incorrectos.');
        }
        return {
            message: 'Autenticacion correcta.',
            email: normalizedEmail,
        };
    }
    async requestPasswordReset(email) {
        const normalizedEmail = this.normalizeEmail(email);
        if (!(await this.userModel.exists({ email: normalizedEmail }))) {
            throw new common_1.NotFoundException('No existe una cuenta con ese correo.');
        }
        const code = this.generateVerificationCode();
        await this.pendingCodeModel.findOneAndUpdate({ email: normalizedEmail }, {
            email: normalizedEmail,
            codeHash: await this.hashValue(code),
            expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
            issuedAt: new Date(),
            purpose: 'reset',
            verifiedAt: null,
            usedAt: null,
            status: 'pending',
        }, { upsert: true, new: true });
        await this.sendVerificationEmail(normalizedEmail, code, 'recuperacion');
        return {
            message: 'Codigo de recuperacion enviado al correo.',
            email: normalizedEmail,
        };
    }
    async confirmPasswordReset(email, code, password) {
        const normalizedEmail = this.normalizeEmail(email);
        const pendingCode = await this.getPendingCodeOrThrow(normalizedEmail, 'reset');
        if (this.isCodeExpired(pendingCode)) {
            await this.markCodeAsExpired(pendingCode);
            throw new common_1.UnauthorizedException('El codigo de recuperacion expiro.');
        }
        if (!(await this.verifyValue(code, pendingCode.codeHash))) {
            throw new common_1.UnauthorizedException('El codigo de recuperacion no es valido.');
        }
        if (this.isPasswordTooShort(password)) {
            throw new common_1.BadRequestException('La contrasena debe tener al menos 6 caracteres.');
        }
        const user = await this.userModel.findOne({ email: normalizedEmail });
        if (!user) {
            throw new common_1.NotFoundException('No existe una cuenta con ese correo.');
        }
        user.passwordHash = await this.hashValue(password ?? '');
        user.updatedAt = new Date();
        await user.save();
        await this.markCodeAsUsed(pendingCode);
        return {
            message: 'Contrasena actualizada correctamente.',
            email: normalizedEmail,
        };
    }
    normalizeEmail(email) {
        const normalizedEmail = email?.trim().toLowerCase();
        if (!normalizedEmail) {
            throw new common_1.BadRequestException('El correo es obligatorio.');
        }
        if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
            throw new common_1.BadRequestException('Ingresa un correo valido.');
        }
        return normalizedEmail;
    }
    generateVerificationCode() {
        return (0, node_crypto_1.randomInt)(10 ** (VERIFICATION_CODE_LENGTH - 1), 10 ** VERIFICATION_CODE_LENGTH).toString();
    }
    async hashValue(value) {
        const salt = (0, node_crypto_1.randomBytes)(16).toString('hex');
        const derivedKey = (await scrypt(value, salt, 64));
        return `${salt}:${derivedKey.toString('hex')}`;
    }
    async verifyValue(value, storedHash) {
        if (!value || !storedHash) {
            return false;
        }
        const [salt, expectedHash] = storedHash.split(':');
        if (!salt || !expectedHash) {
            return false;
        }
        const actualHash = (await scrypt(value, salt, 64));
        const expectedBuffer = Buffer.from(expectedHash, 'hex');
        if (actualHash.length !== expectedBuffer.length) {
            return false;
        }
        return (0, node_crypto_1.timingSafeEqual)(actualHash, expectedBuffer);
    }
    async getPendingCodeOrThrow(email, purpose) {
        const pendingCode = await this.pendingCodeModel.findOne({
            email,
            purpose,
            usedAt: null,
            $or: [{ status: { $exists: false } }, { status: { $in: ['pending', 'verified'] } }],
        });
        if (!pendingCode) {
            throw new common_1.UnauthorizedException('No hay un codigo pendiente para ese correo.');
        }
        return pendingCode;
    }
    isCodeExpired(pendingCode) {
        return Date.now() > pendingCode.expiresAt.getTime();
    }
    async markCodeAsUsed(pendingCode) {
        pendingCode.usedAt = new Date();
        pendingCode.status = 'used';
        await pendingCode.save();
    }
    async markCodeAsExpired(pendingCode) {
        pendingCode.status = 'expired';
        await pendingCode.save();
    }
    isPasswordTooShort(password) {
        return !password || password.trim().length < MIN_PASSWORD_LENGTH;
    }
    async sendVerificationEmail(email, code, context) {
        const transporter = this.createTransporterOrThrow();
        const fromName = process.env.SMTP_FROM_NAME?.trim() || 'Safe Moovment';
        const fromAddress = process.env.SMTP_FROM_EMAIL?.trim() || process.env.SMTP_USER?.trim();
        if (!fromAddress) {
            throw new common_1.BadRequestException('Falta configurar SMTP_FROM_EMAIL o SMTP_USER.');
        }
        const subject = context === 'registro' ? 'Tu codigo de registro' : 'Tu codigo de recuperacion';
        const text = [
            `Hola,`,
            '',
            `Tu codigo de ${context} es: ${code}`,
            '',
            'Este codigo expira en 10 minutos.',
            '',
            'Si no solicitaste este correo, puedes ignorarlo.',
        ].join('\n');
        try {
            await transporter.sendMail({
                from: `"${fromName}" <${fromAddress}>`,
                to: email,
                subject,
                text,
            });
            this.logger.log(`Correo de ${context} enviado a ${email}.`);
        }
        catch (error) {
            this.logger.error(`No se pudo enviar el correo de ${context} a ${email}.`, error);
            throw new common_1.BadRequestException('No se pudo enviar el correo de verificacion.');
        }
    }
    createTransporterOrThrow() {
        const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
        const port = this.parsePort(process.env.SMTP_PORT);
        const secure = this.parseBoolean(process.env.SMTP_SECURE, port === 465);
        const user = process.env.SMTP_USER?.trim();
        const password = this.normalizeAppPassword(process.env.SMTP_PASS);
        if (!user || !password) {
            throw new common_1.BadRequestException('Falta configurar SMTP_USER o SMTP_PASS.');
        }
        return nodemailer_1.default.createTransport({
            host,
            port,
            secure,
            auth: {
                user,
                pass: password,
            },
        });
    }
    parsePort(rawPort) {
        const port = Number(rawPort ?? '587');
        return Number.isFinite(port) && port > 0 ? port : 587;
    }
    parseBoolean(rawValue, fallback) {
        if (rawValue === undefined) {
            return fallback;
        }
        return ['true', '1', 'yes', 'on'].includes(rawValue.trim().toLowerCase());
    }
    normalizeAppPassword(rawPassword) {
        return rawPassword?.replace(/\s+/g, '').trim() ?? '';
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(pending_code_schema_1.PendingCode.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AuthService);
//# sourceMappingURL=auth.service.js.map
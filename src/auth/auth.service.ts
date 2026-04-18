import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import nodemailer from 'nodemailer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingCode, PendingCodeDocument } from './schemas/pending-code.schema';
import { User, UserDocument } from './schemas/user.schema';

const scrypt = promisify(scryptCallback);
const VERIFICATION_CODE_TTL_MS = 10 * 60 * 1000;
const VERIFICATION_CODE_LENGTH = 6;
const MIN_PASSWORD_LENGTH = 6;

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(PendingCode.name) private readonly pendingCodeModel: Model<PendingCode>,
  ) {}

  async startRegistration(email?: string) {
    const normalizedEmail = this.normalizeEmail(email);

    if (await this.userModel.exists({ email: normalizedEmail })) {
      throw new ConflictException('Ese correo ya tiene una cuenta creada.');
    }

    const code = this.generateVerificationCode();
    await this.pendingCodeModel.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        codeHash: await this.hashValue(code),
        expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
        issuedAt: new Date(),
        purpose: 'registration',
        verifiedAt: null,
        usedAt: null,
        status: 'pending',
      },
      { upsert: true, new: true },
    );

    await this.sendVerificationEmail(normalizedEmail, code, 'registro');

    return {
      message: 'Codigo de verificacion enviado al correo.',
      email: normalizedEmail,
    };
  }

  async verifyRegistrationCode(email?: string, code?: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const pendingCode = await this.getPendingCodeOrThrow(normalizedEmail, 'registration');

    if (this.isCodeExpired(pendingCode)) {
      await this.markCodeAsExpired(pendingCode);
      throw new UnauthorizedException('El codigo de verificacion expiro.');
    }

    if (!(await this.verifyValue(code, pendingCode.codeHash))) {
      throw new UnauthorizedException('El codigo de verificacion no es valido.');
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

  async completeRegistration(email?: string, password?: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const pendingCode = await this.getPendingCodeOrThrow(normalizedEmail, 'registration');

    if (await this.userModel.exists({ email: normalizedEmail })) {
      throw new ConflictException('Ese correo ya tiene una cuenta creada.');
    }

    if (this.isCodeExpired(pendingCode)) {
      await this.markCodeAsExpired(pendingCode);
      throw new UnauthorizedException('El codigo de verificacion expiro.');
    }

    if (!pendingCode.verifiedAt) {
      throw new BadRequestException('Primero debes validar el codigo de verificacion.');
    }

    if (this.isPasswordTooShort(password)) {
      throw new BadRequestException('La contrasena debe tener al menos 6 caracteres.');
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

  async login(email?: string, password?: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const user = await this.userModel.findOne({ email: normalizedEmail });

    if (!user) {
      throw new UnauthorizedException('Correo o contrasena incorrectos.');
    }

    if (!(await this.verifyValue(password, user.passwordHash))) {
      throw new UnauthorizedException('Correo o contrasena incorrectos.');
    }

    return {
      message: 'Autenticacion correcta.',
      email: normalizedEmail,
    };
  }

  async requestPasswordReset(email?: string) {
    const normalizedEmail = this.normalizeEmail(email);

    if (!(await this.userModel.exists({ email: normalizedEmail }))) {
      throw new NotFoundException('No existe una cuenta con ese correo.');
    }

    const code = this.generateVerificationCode();
    await this.pendingCodeModel.findOneAndUpdate(
      { email: normalizedEmail },
      {
        email: normalizedEmail,
        codeHash: await this.hashValue(code),
        expiresAt: new Date(Date.now() + VERIFICATION_CODE_TTL_MS),
        issuedAt: new Date(),
        purpose: 'reset',
        verifiedAt: null,
        usedAt: null,
        status: 'pending',
      },
      { upsert: true, new: true },
    );

    await this.sendVerificationEmail(normalizedEmail, code, 'recuperacion');

    return {
      message: 'Codigo de recuperacion enviado al correo.',
      email: normalizedEmail,
    };
  }

  async confirmPasswordReset(email?: string, code?: string, password?: string) {
    const normalizedEmail = this.normalizeEmail(email);
    const pendingCode = await this.getPendingCodeOrThrow(normalizedEmail, 'reset');

    if (this.isCodeExpired(pendingCode)) {
      await this.markCodeAsExpired(pendingCode);
      throw new UnauthorizedException('El codigo de recuperacion expiro.');
    }

    if (!(await this.verifyValue(code, pendingCode.codeHash))) {
      throw new UnauthorizedException('El codigo de recuperacion no es valido.');
    }

    if (this.isPasswordTooShort(password)) {
      throw new BadRequestException('La contrasena debe tener al menos 6 caracteres.');
    }

    const user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) {
      throw new NotFoundException('No existe una cuenta con ese correo.');
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

  private normalizeEmail(email?: string): string {
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new BadRequestException('El correo es obligatorio.');
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      throw new BadRequestException('Ingresa un correo valido.');
    }

    return normalizedEmail;
  }

  private generateVerificationCode(): string {
    return randomInt(10 ** (VERIFICATION_CODE_LENGTH - 1), 10 ** VERIFICATION_CODE_LENGTH).toString();
  }

  private async hashValue(value: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scrypt(value, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  private async verifyValue(value?: string, storedHash?: string): Promise<boolean> {
    if (!value || !storedHash) {
      return false;
    }

    const [salt, expectedHash] = storedHash.split(':');
    if (!salt || !expectedHash) {
      return false;
    }

    const actualHash = (await scrypt(value, salt, 64)) as Buffer;
    const expectedBuffer = Buffer.from(expectedHash, 'hex');

    if (actualHash.length !== expectedBuffer.length) {
      return false;
    }

    return timingSafeEqual(actualHash, expectedBuffer);
  }

  private async getPendingCodeOrThrow(
    email: string,
    purpose: 'registration' | 'reset',
  ): Promise<PendingCodeDocument> {
    const pendingCode = await this.pendingCodeModel.findOne({
      email,
      purpose,
      usedAt: null,
      $or: [{ status: { $exists: false } }, { status: { $in: ['pending', 'verified'] } }],
    });

    if (!pendingCode) {
      throw new UnauthorizedException('No hay un codigo pendiente para ese correo.');
    }

    return pendingCode;
  }

  private isCodeExpired(pendingCode: PendingCodeDocument): boolean {
    return Date.now() > pendingCode.expiresAt.getTime();
  }

  private async markCodeAsUsed(pendingCode: PendingCodeDocument): Promise<void> {
    pendingCode.usedAt = new Date();
    pendingCode.status = 'used';
    await pendingCode.save();
  }

  private async markCodeAsExpired(pendingCode: PendingCodeDocument): Promise<void> {
    pendingCode.status = 'expired';
    await pendingCode.save();
  }

  private isPasswordTooShort(password?: string): boolean {
    return !password || password.trim().length < MIN_PASSWORD_LENGTH;
  }

  private async sendVerificationEmail(email: string, code: string, context: string): Promise<void> {
    const transporter = this.createTransporterOrThrow();
    const fromName = process.env.SMTP_FROM_NAME?.trim() || 'Safe Moovment';
    const fromAddress = process.env.SMTP_FROM_EMAIL?.trim() || process.env.SMTP_USER?.trim();

    if (!fromAddress) {
      throw new BadRequestException('Falta configurar SMTP_FROM_EMAIL o SMTP_USER.');
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
    } catch (error) {
      this.logger.error(`No se pudo enviar el correo de ${context} a ${email}.`, error as Error);
      throw new BadRequestException('No se pudo enviar el correo de verificacion.');
    }
  }

  private createTransporterOrThrow() {
    const host = process.env.SMTP_HOST?.trim() || 'smtp.gmail.com';
    const port = this.parsePort(process.env.SMTP_PORT);
    const secure = this.parseBoolean(process.env.SMTP_SECURE, port === 465);
    const user = process.env.SMTP_USER?.trim();
    const password = this.normalizeAppPassword(process.env.SMTP_PASS);

    if (!user || !password) {
      throw new BadRequestException('Falta configurar SMTP_USER o SMTP_PASS.');
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass: password,
      },
    });
  }

  private parsePort(rawPort: string | undefined): number {
    const port = Number(rawPort ?? '587');
    return Number.isFinite(port) && port > 0 ? port : 587;
  }

  private parseBoolean(rawValue: string | undefined, fallback: boolean): boolean {
    if (rawValue === undefined) {
      return fallback;
    }

    return ['true', '1', 'yes', 'on'].includes(rawValue.trim().toLowerCase());
  }

  private normalizeAppPassword(rawPassword: string | undefined): string {
    return rawPassword?.replace(/\s+/g, '').trim() ?? '';
  }
}
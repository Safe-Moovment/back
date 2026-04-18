import { Body, Controller, Post } from '@nestjs/common';
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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register/start')
  startRegister(@Body() body: RegisterStartBody) {
    return this.authService.startRegistration(body.email);
  }

  @Post('register/verify')
  verifyRegister(@Body() body: RegisterVerifyBody) {
    return this.authService.verifyRegistrationCode(body.email, body.code);
  }

  @Post('register/complete')
  completeRegister(@Body() body: RegisterCompleteBody) {
    return this.authService.completeRegistration(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: LoginBody) {
    return this.authService.login(body.email, body.password);
  }

  @Post('reset/request')
  requestReset(@Body() body: ResetRequestBody) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('reset/confirm')
  confirmReset(@Body() body: ResetConfirmBody) {
    return this.authService.confirmPasswordReset(body.email, body.code, body.password);
  }
}
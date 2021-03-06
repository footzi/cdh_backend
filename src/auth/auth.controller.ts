import { Controller, Get, Post, UseGuards, Request, Body, Delete, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { errorHandler } from '../utils/errorHandler';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { successHandler } from '../utils/successHandler';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/api/auth/login')
  async login(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      errorHandler(error);
    }
  }

  // JWTREFRESHGUARD @todo должна быть
  @UseGuards(AuthGuard('jwt-refreshtoken'))
  @Put('/api/auth/refresh')
  async refresh(@Request() req) {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      errorHandler(error);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/api/auth/logout')
  async logout(@Request() req) {
    try {
      await this.authService.logout(req.user.id);
      return successHandler();
    } catch (error) {
      errorHandler(error);
    }
  }
}

import { Controller, Get, Post, UseGuards, Request, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('/api/auth/login')
  async login(@Body() test) {
    console.log(test);
    // return this.authService.login(req.user);
  }
  // async login(@Request() req) {
  //   console.log(req);
  //   return this.authService.login(req.user);
  // }
}

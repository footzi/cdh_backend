import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '../users/interfaces/users.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(id: string, password: string): Promise<number> {
    console.log(id);
    console.log(password);
    // const user = await this.authService.validateUser(id, password);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    return 2323;
  }
}

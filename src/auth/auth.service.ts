import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User } from '../users/interfaces/users.interface';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  /**
   * Проверка пользователя
   * @param id - id
   * @param pass - пароль
   */
  async validateUser(id: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findById(id);

    // тут должно быть шифрование basecrypt
    if (user && user.isConfirm && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  /**
   * Авторизация пользователя
   * @param {User} user - пользователь
   */
  async login(user: User) {
    const payload = { login: user.login, id: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

import { Client, User } from './interfaces/users.interface';

export class UserUtils {
  /**
   * Конвертирует тип User к типу Client
   *
   * @param {User} user - пользователь
   */
  static convertToClient(user: User): Client {
    const { password, roles, isConfirm, isActive, ...rest } = user;

    return rest;
  }
}

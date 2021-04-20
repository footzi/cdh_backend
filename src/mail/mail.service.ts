import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MailToClientAfterOrderCreate,
  MailToAdminAfterOrderCreate,
  MailToAdminCallback,
} from './interfaces/mail.interfaces';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService, private configService: ConfigService) {}

  async sendClientAfterOrderCreate(data: MailToClientAfterOrderCreate) {
    const { email } = data;

    await this.mailerService.sendMail({
      to: email,
      subject: 'У вас новая бронь',
      template: 'order-to-client',
      context: {
        ...data,
      },
    });
  }

  async sendAdminOfterOrderCreate(data: MailToAdminAfterOrderCreate) {
    await this.mailerService.sendMail({
      to: this.configService.get('mail').admin,
      subject: 'Была создана новая бронь',
      template: 'order-to-admin',
      context: {
        ...data,
      },
    });
  }

  async sendAdminCallback(data: MailToAdminCallback) {
    await this.mailerService.sendMail({
      to: this.configService.get('mail').admin,
      subject: 'Пришла заявка с сайта',
      template: 'callback-to-admin',
      context: {
        ...data,
      },
    });
  }
}

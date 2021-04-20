import { Injectable } from '@nestjs/common';

import { MailService } from '../mail/mail.service';
import { SendCallbackDto } from './dto/send-callback-dto';

@Injectable()
export class CallbackService {
  constructor(private mailService: MailService) {}

  async send(sendCallbackDto: SendCallbackDto): Promise<boolean> {
    try {
      await this.mailService.sendAdminCallback(sendCallbackDto);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  }
}

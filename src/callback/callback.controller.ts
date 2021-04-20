import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { SendCallbackDto } from './dto/send-callback-dto';
import { ErrorHandler } from '../utils/errorHandler';
import { CallbackService } from './callback.service';

@Controller('callback')
export class CallbackController {
  constructor(private readonly callbackService: CallbackService) {}

  @Post()
  @HttpCode(200)
  async send(@Body() sendCallbackDto: SendCallbackDto): Promise<{ isSuccessful: boolean }> {
    try {
      return {
        isSuccessful: await this.callbackService.send(sendCallbackDto),
      };
    } catch (error) {
      ErrorHandler(error);
    }
  }
}

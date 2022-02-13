import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';
import config from './config';

import { Stream } from './stream';

dayjs.extend(isBetween);

async function bootstrap() {
  const { port, useCors } = config();

  const app = await NestFactory.create(AppModule, { cors: useCors });
  await app.listen(port);

  // new Stream().start();
}
bootstrap();

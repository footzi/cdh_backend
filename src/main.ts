import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  await app.listen(7000);
}
bootstrap();

import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ConfigKeys } from './base/config.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>(ConfigKeys.SERVER_PORT));
}
bootstrap();

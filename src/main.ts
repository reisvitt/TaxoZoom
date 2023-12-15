import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const configService = new ConfigService();

  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });

  await app.listen(configService.get('PORT') || 3000);
}
bootstrap();

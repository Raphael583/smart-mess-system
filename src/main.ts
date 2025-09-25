import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
    dotenv.config();
  const app = await NestFactory.create(AppModule);

  // ✅ Enable request validation
  app.useGlobalPipes(new ValidationPipe());

  // ✅ Enable CORS for frontend (React on port 8080)
  app.enableCors({
    origin: 'http://localhost:8080',
    credentials: true,
  });

  // ✅ Start backend
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

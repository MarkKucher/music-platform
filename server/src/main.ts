import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ErrorMiddleware } from './user/middlewares/error-middleware';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { CLIENT, PORT } from './utils';

const start = async () => {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      credentials: true,
      origin: [CLIENT, 'http://localhost:3000']
    });
    app.use(cookieParser());
    app.useGlobalPipes(new ValidationPipe());
    app.use(ErrorMiddleware);
    await app.listen(PORT, () => console.log(`Server runs on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();

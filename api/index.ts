import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Request, Response } from 'express';
const server = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );

    app.enableCors({ origin: '*' });

    const config = new DocumentBuilder()
      .setTitle('JWT')
      .setDescription('Authorization Practice')
      .setVersion('1.0')
      .addTag('APIs')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.init();
    cachedApp = app;
  }

  return server;
}

export default async function handler(req:Request, res:Response) {
  const srv = await bootstrap();
  return srv(req, res);
}
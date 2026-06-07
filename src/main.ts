// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { NestExpressApplication } from '@nestjs/platform-express';

// async function bootstrap() {
//   const app =
//     await NestFactory.create<NestExpressApplication>(AppModule);

//   // PORT
//   const PORT = process.env.PORT ?? 3002;

//   // SWAGGER CONFIG
//   const config = new DocumentBuilder()
//     .setTitle('JWT')
//     .setDescription('Authorization Practice')
//     .setVersion('1.0')
//     .addServer(`http://localhost:${PORT}`)
//     //.addBearerAuth()
//     .addTag('APIs')
//     .build();

//   const document = SwaggerModule.createDocument(app, config);

//   SwaggerModule.setup('api', app, document);
//   await app.listen(PORT);

//   console.log(`Application is running on port ${PORT}`);

// }
// bootstrap();
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const server = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(server),
    );

    app.enableCors({
      origin: '*',
    });

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

// ✅ IMPORTANT: Vercel handler style
export default async function handler(req, res) {
  const srv = await bootstrap();
  return srv(req, res);
}
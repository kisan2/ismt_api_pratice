import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app =
    await NestFactory.create<NestExpressApplication>(AppModule);

  // PORT
  const PORT = process.env.PORT ?? 3002;
app.setGlobalPrefix('api');
  // SWAGGER CONFIG
  const config = new DocumentBuilder()
    .setTitle('JWT')
    .setDescription('Authorization Practice')
    .setVersion('1.0')
    .addServer(`http://localhost:${PORT}`)
    //.addBearerAuth()
    .addTag('APIs')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(PORT);

  console.log(`Application is running on port ${PORT}`);

}
bootstrap();

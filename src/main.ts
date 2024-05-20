import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import * as fs from 'fs';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('../pet-care/secrets/cert.key'),
  //   cert: fs.readFileSync('../pet-care/secrets/cert.crt'),
  // };

  const app = await NestFactory.create(
    AppModule,
    //{ httpsOptions }
  );
  const config = new DocumentBuilder()
    .setTitle('Sales API')
    .setDescription('Sales API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // Disable whitelist
      forbidNonWhitelisted: true, // Ensure non-whitelisted properties are rejected
      transform: true,
      skipMissingProperties: true,
    }),
  );

  await app.listen(443);
  const server = app.getHttpServer();
  const address = server.address();
  const port = typeof address === 'string' ? address : address?.port;
  console.log(`NestJS application is running on port ${port}`);
};

bootstrap();

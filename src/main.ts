import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import * as fs from 'fs';

async function bootstrap() {
  const httpsOptions = {
    key: fs.readFileSync('./secrets/furever-prkey.key'),
    cert: fs.readFileSync('./secrets/fureverpkey.cer'),
  };

  const app = await NestFactory.create(
    AppModule,
    { httpsOptions }
  );
  const config = new DocumentBuilder()
    .setTitle('Sales API')
    .setDescription('Sales API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 }
  });

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

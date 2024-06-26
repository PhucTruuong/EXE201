import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
// import * as fs from 'fs';
import { urlencoded, json } from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import { AllExceptionsFilter } from './all-exception.filter';
// import * as csurf from 'csurf';
// import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  // const httpsOptions = {
  //   key: fs.readFileSync('./secrets/furever-prkey.key'),
  //   cert: fs.readFileSync('./secrets/fureverpkey.cer'),
  // };

  const app = await NestFactory.create(
    AppModule,
    //  { httpsOptions }
  );
  const config = new DocumentBuilder()
    .setTitle('Furever Friend API')
    .setDescription('Furever Friend API Description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: { defaultModelsExpandDepth: -1 },
  });

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  // app.use(cookieParser());
  // app.use(csurf({ cookie: { sameSite: true } }));

  // app.use((req: any, res: any, next: any) => {
  //   console.log('CSRF Middleware');
  //   const token = req.csrfToken();
  //   console.log('CSRF Token: ', token);
  //   res.cookie('XSRF-TOKEN', token);
  //   res.locals.csrfToken = token;
  //   next();
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false, // Disable whitelist
      forbidNonWhitelisted: true, // Ensure non-whitelisted properties are rejected
      transform: true,
      skipMissingProperties: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const whitelist = [
    'http://localhost:5173',
    'http://localhost:8000',
    'https://api.fureverfriend.id.vn',
    'https://fureverfriend.id.vn',
    'http://localhost:8081'
  ];

  app.enableCors({
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(morgan());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.use(bodyParser());
  const nestPort = process.env.NEST_PORT || 8000;
  await app.listen(nestPort);
  const server = app.getHttpServer();
  const address = server.address();
  const port = typeof address === 'string' ? address : address?.port;
  console.log(`NestJS application is running on port ${port}`);
}

bootstrap();

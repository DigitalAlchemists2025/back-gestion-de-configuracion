import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AllExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const cors = require('cors')
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TimeOutInterceptor());
  app.useGlobalPipes(new ValidationPipe());

  app.use(cors({
    origin: [process.env.FRONT_URL, process.env.FRONT_URL_ALT, process.env.FRONT_MOVIL_URL],
    methods: ['GET', 'POST','PUT','DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  const options = new DocumentBuilder()
    .setTitle('API de Componentes')
    .setDescription('Documentación de la API para la gestión de componentes')
    .setVersion('1.0.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      filter: true,
    },
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') ?? 3000;
  const appEx = app as unknown as NestExpressApplication;
  appEx.useStaticAssets(join(process.cwd(), 'uploads'));

  const docConfig = new DocumentBuilder()
    .setTitle('Pedidos API')
    .setDescription('Microserviço de clientes e pedidos')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, docConfig);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port);
}

bootstrap();

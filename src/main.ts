import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { UsersService } from './modules/users/users.service';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO da yo‘q fieldlarni avtomatik olib tashlaydi
      forbidNonWhitelisted: true, // DTO da yo‘q field bo‘lsa xato qaytaradi
      transform: true, // stringlarni number yoki boolean kabi tipga o‘giradi,
      transformOptions: { enableImplicitConversion: true }, // Implicit konversiyani yoqish
    }),
  );

  // Static fayllarni sozlash
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Rasmlar URL’dan /uploads/ orqali kiriladi
  });

  const userService = app.get(UsersService);
  await userService.createAdminUser();

  // Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle('Resource API')
    .setDescription('API for managing resources with JWT authentication')
    .setVersion('1.0')
    .addBearerAuth() // Bearer Auth ham saqlanadi
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Tokenni saqlab qolish uchun
    },
  });

  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `Application is running on: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `Swagger UI is available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}
bootstrap();

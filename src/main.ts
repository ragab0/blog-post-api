import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: ['http://localhost:5173', 'https://ragab-blog.vercel.app'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('DevBlog API')
    .setDescription(
      'The DevBlog API - A comprehensive blogging platform API with authentication, posts, comments, and user management',
    )
    .setVersion('1.0')
    .addBearerAuth()
    // .addTag('auth', 'Authentication endpoints')
    // .addTag('posts', 'Blog posts endpoints')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}

bootstrap();

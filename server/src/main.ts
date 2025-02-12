import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:3000', // Cho phép tất cả các nguồn
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Các phương thức được phép
    allowedHeaders: 'Content-Type, Authorization', // Các header được phép
  });
  
  await app.listen(process.env.PORT || 3001);

}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV == 'development')
    console.log('Yay we entered development MODE!');
  app.enableCors();
  await app.listen(3001);
}
bootstrap();

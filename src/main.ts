import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so your React Native app can communicate with it later
  app.enableCors();

  // 1. Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Smart Notify API')
    .setDescription('The backend API for the Smart Notify mobile app.')
    .setVersion('1.0')
    .addBearerAuth() // This will allow you to test JWT protected routes later!
    .build();

  // 2. Create the Swagger Document
  const document = SwaggerModule.createDocument(app, config);

  // 3. Setup the Swagger UI at the '/api' route
  SwaggerModule.setup('api', app, document);

  // Start the server on the port defined in .env, or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
void bootstrap();

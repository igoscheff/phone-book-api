import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  //Swagger
  const options = new DocumentBuilder()
    .setTitle('My REST API')
    .setDescription('Here you can get acquainted with the API (routes and DTO schemas), and test various requests.')
    .setVersion('1.0')
    .addTag('User')
    .addTag('Auth')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    }, 'JWT')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('api', app, document)

  app.enableCors()

  await app.listen(process.env.PORT)
}

bootstrap()

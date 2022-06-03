import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    logger: ['verbose'],
    transport: Transport.RMQ,
    options: {
      urls: [ process.env.QUEUE_URL ],
      queue: process.env.QUEUE_NAME,
      queueOptions: { durable: true }
    }
  });

  await app.listen();
}
bootstrap();

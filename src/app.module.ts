import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkerService } from './worker.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [WorkerService],
  providers: [],
})
export class AppModule {}

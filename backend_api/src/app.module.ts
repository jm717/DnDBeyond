import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HpModule } from './hp/hp.module';

@Module({
  imports: [HpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

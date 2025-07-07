import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WageModule } from './wage/wage.module';

@Module({
  imports: [WageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

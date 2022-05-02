import { Module } from '@nestjs/common';
import configModule from './base/config.module';
import { ViewModule } from './view/view.module';

@Module({
  imports: [configModule, ViewModule],
})
export class AppModule {}

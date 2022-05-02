import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ResourceHandlerMiddleware } from './resource-handler.middleware';

@Module({})
export class ViewModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ResourceHandlerMiddleware).forRoutes('/');
  }
}

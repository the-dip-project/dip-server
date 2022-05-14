import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { ConfigKeys } from './config.module';

export default TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'sqlite',
    entities: [],
    enableWAL: true,
    database: resolve(configService.get(ConfigKeys.DATAPATH), 'dip.db'),
    autoLoadEntities: true,
  }),
});

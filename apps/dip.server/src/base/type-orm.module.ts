import { resolve } from 'path';

import { Entities } from '@/common/entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigKeys } from './config.module';

export default TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'sqlite',
    entities: Entities,
    enableWAL: true,
    database: resolve(configService.get(ConfigKeys.DATAPATH), 'dip.db'),
    autoLoadEntities: true,
    synchronize: true,
  }),
});

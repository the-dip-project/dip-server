import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AuthGuardModule } from './auth-guard/auth-guard.module';
import configModule, { ConfigKeys } from './base/config.module';
import typeOrmModule from './base/type-orm.module';
import { DnsModule } from './dns/dns.module';
import { DomainModule } from './domain/domain.module';
import { UserModule } from './user/user.module';
import { ViewModule } from './view/view.module';
import { PingModule } from './ping/ping.module';

@Module({
  imports: [
    configModule,
    typeOrmModule,
    ViewModule,
    AuthGuardModule,
    DnsModule,
    UserModule,
    DomainModule,
    PingModule,
  ],
})
export class AppModule {
  private readonly logger = new Logger(AppModule.name);

  constructor(configService: ConfigService) {
    this.logger.log(
      `AppInstance is listening on port ${configService.get<number>(
        ConfigKeys.SERVER_PORT,
      )}`,
    );
  }
}

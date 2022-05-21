import { createServer } from 'dns2';

import { DomainEntity, RecordEntity } from '@/common/entities';
import { CacheModule, Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConfigKeys } from '../base/config.module';
import { DnsService } from './dns.service';

@Module({
  imports: [
    ConfigModule,
    CacheModule.register({ max: 1000 }),
    TypeOrmModule.forFeature([DomainEntity, RecordEntity]),
  ],
  providers: [DnsService],
})
export class DnsModule {
  private readonly logger: Logger = new Logger('DnsModule');
  private readonly server: ReturnType<typeof createServer>;

  public constructor(
    private readonly configService: ConfigService,
    dnsService: DnsService,
  ) {
    const ports = this.preparePorts();

    this.server = createServer({
      tcp: typeof ports.tcp === 'number',
      udp: typeof ports.udp === 'number',
      doh: typeof ports.doh === 'number',
      handle: dnsService.handle.bind(dnsService),
    });

    this.logger.log(
      `DNS server is listening on ports: ${Object.keys(ports)
        .map((proto) => `${ports[proto]}/${proto}`)
        .join(', ')}`,
    );

    this.server.listen(ports);
  }

  private preparePorts(): { tcp?: number; udp?: number; doh?: number } {
    const ports = {};

    const checkAndMerge = (port, name) => port !== -1 && (ports[name] = port);

    const { configService } = this;

    checkAndMerge(configService.get<number>(ConfigKeys.UDP_PORT), 'udp');
    checkAndMerge(configService.get<number>(ConfigKeys.TCP_PORT), 'tcp');
    checkAndMerge(configService.get<number>(ConfigKeys.DOH_PORT), 'doh');

    return ports;
  }
}

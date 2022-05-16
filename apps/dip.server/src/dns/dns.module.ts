import { createServer } from 'dns2';

import { Logger, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { DnsService } from './dns.service';
import { ConfigKeys } from '../base/config.module';

@Module({
  imports: [ConfigModule],
  providers: [DnsService],
})
export class DnsModule {
  private readonly logger: Logger = new Logger('DnsModule');
  private readonly server: ReturnType<typeof createServer>;

  public constructor(
    private readonly configService: ConfigService,
    dnsService: DnsService,
  ) {
    this.server = createServer({
      tcp: true,
      udp: true,
      doh: true,
      handle: dnsService.handle,
    });

    const ports = this.preparePorts();

    this.logger.log(
      `DNS server is listening on ports: ${Object.keys(ports)
        .map((proto) => `${ports[proto]}/${proto}`)
        .join(', ')}`,
    );

    this.server.listen(ports);
  }

  private preparePorts() {
    const ports = {};

    const checkAndMerge = (port, name) => port !== -1 && (ports[name] = port);

    checkAndMerge(this.configService.get<number>(ConfigKeys.UDP_PORT), 'udp');
    checkAndMerge(this.configService.get<number>(ConfigKeys.TCP_PORT), 'tcp');
    checkAndMerge(this.configService.get<number>(ConfigKeys.DOH_PORT), 'doh');

    return ports;
  }
}

import { Cache } from 'cache-manager';
import { RemoteInfo } from 'dgram';
import { DnsAnswer, DnsRequest, DnsResponse, Packet } from 'dns2';

import { FallbackAddress } from '@/common/models/fallback-address';
import { CACHE_MANAGER, Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigKeys } from '../base/config.module';
import { DnsClientService } from './dns-client/dns-client.service';

@Injectable({
  scope: Scope.DEFAULT,
})
export class DnsService {
  public constructor(
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  public async handle(
    request: DnsRequest,
    send: (res: DnsResponse) => void,
    _remoteInfo: RemoteInfo,
  ): Promise<void> {
    const start = +new Date();
    console.time('Query@' + start);
    const fallbackServers = this.configService.get<FallbackAddress[]>(
      ConfigKeys.FALLBACKS,
    );

    const response = Packet.createResponseFromRequest(request);
    const { questions } = request;
    const { cacheManager } = this;

    await Promise.all(
      questions.map(async (question) => {
        const cacheKey = `${question.name}-${question.name}`;
        const cached = await cacheManager.get<DnsAnswer[]>(cacheKey);

        if (cached) {
          response.answers.push(...cached);
          return;
        }

        for (const fallback of fallbackServers) {
          const { host, port, proto } = fallback;
          const client = new DnsClientService(host, port, proto);

          const result = await client.resolve(question);

          response.answers.push(...result);

          if (result.length !== 0) break;
        }

        cacheManager.set(cacheKey, response.answers, {
          ttl: Math.min(...response.answers.map((answer) => answer.ttl)),
        });
      }),
    );

    send(response);
    console.timeEnd('Query@' + start);
  }
}

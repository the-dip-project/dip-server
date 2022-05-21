import { Cache } from 'cache-manager';
import { RemoteInfo } from 'dgram';
import { DnsAnswer, DnsQuestion, DnsRequest, DnsResponse, Packet } from 'dns2';

import { FallbackAddress } from '@/common/models/fallback-address';
import { CACHE_MANAGER, Inject, Injectable, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ConfigKeys } from '../base/config.module';
import { DnsClientService } from './dns-client/dns-client.service';
import { InjectRepository } from '@nestjs/typeorm';
import { DomainEntity, RecordEntity } from '@/common/entities';
import { FindConditions, Repository } from 'typeorm';

@Injectable({
  scope: Scope.DEFAULT,
})
export class DnsService {
  private readonly fallbackServers: FallbackAddress[];

  public constructor(
    configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectRepository(RecordEntity)
    private readonly recordRepository: Repository<RecordEntity>,
    @InjectRepository(DomainEntity)
    private readonly domainEntity: Repository<DomainEntity>,
  ) {
    this.fallbackServers = configService.get<FallbackAddress[]>(
      ConfigKeys.FALLBACKS,
    );
  }

  private prepareAdditionalData(
    question: DnsQuestion,
    record: RecordEntity,
  ): Record<string, unknown> {
    const additional: Record<string, unknown> = (() => {
      switch (record.type) {
        case Packet.TYPE.MX: {
          const [priority, exchange] = record.extendedData.split('|');

          return {
            priority: Number(priority),
            exchange: exchange,
          };
        }

        default:
          break;
      }

      return {};
    })();

    if (!('name' in additional)) additional.name = question.name;
    if (!('address' in additional)) additional.address = record.data;

    return additional;
  }

  private async resolve(question: DnsQuestion): Promise<DnsAnswer[]> {
    const { name } = question;
    const parts = name.split('.');
    const higherLevelDomain = parts.slice(1).join('.');
    const sub = parts[0];

    const domains = await this.domainEntity.find({
      where: [{ domain: name }, { domain: higherLevelDomain }],
      loadEagerRelations: false,
    });

    if (domains.length === 0) return [];

    const higher = domains.find(({ domain }) => domain === higherLevelDomain);
    const lower = domains.find(({ domain }) => domain === name);

    const whereConditions: FindConditions<RecordEntity>[] = [];

    lower &&
      whereConditions.push({
        domainId: lower.id,
        host: '@',
        type: question['type'],
        class: question['class'],
      });

    higher &&
      whereConditions.push({
        domainId: higher.id,
        host: sub,
        type: question['type'],
        class: question['class'],
      });

    const records = await this.recordRepository.find({
      where: whereConditions,
      loadEagerRelations: false,
    });

    return records.map(
      (record) =>
        ({
          type: question['type'],
          class: question['class'],
          ttl: record.ttl,
          ...this.prepareAdditionalData(question, record),
        } as unknown as DnsAnswer),
    );
  }

  public async handle(
    request: DnsRequest,
    send: (res: DnsResponse) => void,
    _remoteInfo: RemoteInfo,
  ): Promise<void> {
    const start = +new Date();
    console.time('Query@' + start);

    const { fallbackServers } = this;

    const response = Packet.createResponseFromRequest(request);
    const { questions } = request;
    const { cacheManager } = this;

    await Promise.all(
      questions.map(async (question) => {
        const cacheKey = `${question.name}-${question['type']}`;
        const cached = await cacheManager.get<DnsAnswer[]>(cacheKey);

        if (cached) {
          response.answers.push(...cached);
          return;
        }

        const answer = await this.resolve(question);

        if (answer.length === 0)
          for (const fallback of fallbackServers) {
            const { host, port, proto } = fallback;
            const client = new DnsClientService(host, port, proto);

            const result = await client.resolve(question);

            response.answers.push(...result);

            if (result.length !== 0) break;
          }
        else response.answers.push(...answer);

        cacheManager.set(cacheKey, response.answers, {
          ttl: Math.min(...response.answers.map((answer) => answer.ttl)),
        });
      }),
    );

    send(response);
    setImmediate(() => console.timeEnd('Query@' + start));
  }
}

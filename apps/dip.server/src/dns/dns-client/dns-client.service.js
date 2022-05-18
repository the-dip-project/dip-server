/* eslint-disable */

import { FallbackProtocols } from '@/common/models/fallback-address.ts';

const { UDPClient, TCPClient, DOHClient } = require('dns2');
const { query: TLSClient } = require('dns-over-tls');

export class DnsClientService {
  #_internals = {
    host: '',
    port: 0,
    proto: '',
  };

  static #clientMap = {
    udp: UDPClient,
    tcp: TCPClient,
    http: DOHClient,
    https: DOHClient,
  };

  static #typeMap = {
    1: 'A',
    2: 'NS',
    3: 'MD',
    4: 'MF',
    5: 'CNAME',
    6: 'SOA',
    7: 'MB',
    8: 'MG',
    9: 'MR',
    10: 'NULL',
    11: 'WKS',
    12: 'PTR',
    13: 'HINFO',
    14: 'MINFO',
    15: 'MX',
    16: 'TXT',
    28: 'AAAA',
    33: 'SRV',
    41: 'EDNS',
    99: 'SPF',
    252: 'AXFR',
    253: 'MAILB',
    254: 'MAILA',
    255: 'ANY',
    257: 'CAA',
  };

  constructor(host, port, proto) {
    this.#_internals.host = host;
    this.#_internals.port = port;

    if (!FallbackProtocols.includes(proto))
      throw new TypeError('Unacceptable protocol');

    this.#_internals.proto = proto;
  }

  async #usingDns2(question) {
    if (!question) return [];

    const address = this.#_internals.proto.match(/^http/)
      ? `${this.#_internals.host}:${this.#_internals.port}${
          this.#_internals.path
        }`
      : `${this.#_internals.host}`;

    const resolve = DnsClientService.#clientMap[this.#_internals.proto]({
      dns: address,
      port: this.#_internals.port,
      http: this.#_internals.proto === 'http',
    });

    const result = await resolve(
      question.name,
      DnsClientService.#typeMap[question.type],
    );

    return result.answers;
  }

  async #usingDot() {}

  async resolve(question) {
    const result = [];

    if (this.#_internals.proto in DnsClientService.#clientMap) {
      result.push(...(await this.#usingDns2(question)));
    }

    return result;
  }
}

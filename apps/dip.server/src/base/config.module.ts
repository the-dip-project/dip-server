import { randomBytes } from 'crypto';
import { existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import * as Joi from 'joi';
import { join, resolve } from 'path';

import { Environments } from '@/common/constants/environments';
import { byHours, byMinutes } from '@/common/helpers/timespan';
import {
  FallbackAddress,
  FallbackProtocols,
} from '@/common/models/fallback-address';
import { ConfigModule } from '@nestjs/config';

export type Schema = {
  port: number;
  env: Environments;
  cookie: {
    secret?: string;
  };
  data: {
    path: string;
  };
  fallbackServers: Array<FallbackAddress>;
  ports: {
    udp: number;
    tcp: number;
    doh: number;
  };
  expirations: {
    authToken: number;
    escalatedAuthToken: number;
  };
};

function defaultDatapath(): string {
  return resolve(
    process.env.APPDATA ? process.env.APPDATA : process.env.HOME,
    '.dip',
    'data',
  );
}

function loadCookieSecret(): string {
  const secretLocation = join(__dirname, 'cookie-secret');

  if (!existsSync(secretLocation) || statSync(secretLocation).isFile()) {
    const secret = randomBytes(32).toString('utf-8');

    writeFileSync(secretLocation, secret, 'utf-8');
    return secret;
  }

  return readFileSync(secretLocation, 'utf-8');
}

const fallbacks = [];
const defaultPort = {
  http: 80,
  https: 443,
  tls: 853,
  tcp: 53,
  udp: 53,
};

function load(): Schema {
  const env = ['development', 'production'].indexOf(process.env.ENVIRONMENT);
  const datapath = !process.env.DATAPATH?.length
    ? defaultDatapath()
    : resolve(__dirname, process.env.DATAPATH);

  return {
    port: Number(process.env.PORT),
    env,
    cookie: {
      secret: env === Environments.PRODUCTION ? loadCookieSecret() : undefined,
    },
    data: { path: datapath },
    fallbackServers: fallbacks.map(
      ({ host, port: _port, path: _path, proto: _proto }) => {
        const proto = _proto ?? 'udp';
        const port = _port ? Number(_port) : defaultPort[proto];

        return {
          host,
          port,
          proto,
        };
      },
    ),
    ports: {
      udp: Number(process.env.UDP_PORT),
      tcp: Number(process.env.TCP_PORT),
      doh: Number(process.env.DOH_PORT),
    },
    expirations: {
      authToken: Number(process.env.AUTH_TOKEN_EXPIRATION),
      escalatedAuthToken: Number(process.env.ESCALATED_AUTH_TOKEN_EXPIRATION),
    },
  };
}

const customJoi = Joi.extend((joi) => ({
  base: joi.array(),
  type: 'stringArray',
  coerce: ((value) =>
    typeof value === 'string'
      ? { value: value.split(',') }
      : { value }) as Joi.CoerceFunction,
})).extend((joi) => ({
  base: joi.object(),
  type: 'dnsFallback',
  coerce: ((value) => {
    if (typeof value !== 'string') return value;

    const [address, proto] = value.split('/');
    const url = new URL(
      address.match(/^(http|https)/i) ? address : 'http://' + address,
    );
    const { hostname: host, port, pathname: path } = url;

    fallbacks.push({ host, port, path, proto });

    return {
      value: { host, port, proto: proto ?? 'udp' },
    };
  }) as Joi.CoerceFunction,
}));

const schema = Joi.object({
  PORT: Joi.number().min(1).max(65535).required(),
  ENVIRONMENT: Joi.string()
    .valid('development', 'production')
    .default('production'),
  DATAPATH: Joi.alternatives(
    Joi.string()
      .allow(null, '')
      .pattern(
        /^(?:[a-z]:)?[\/\\]{0,2}(?:[.\/\\ ](?![.\/\\\n])|[^<>:"|?*.\/\\ \n])+$/,
      ),
    Joi.string()
      .allow(null, '')
      .pattern(/^(\/)?([^/\0]+(\/)?)+$/),
  ),
  FALLBACKS: customJoi
    .stringArray()
    .items(
      customJoi.dnsFallback({
        host: Joi.string().hostname().required(),
        port: Joi.number().min(1).max(65535).empty(''),
        proto: Joi.string()
          .valid(...FallbackProtocols)
          .default('udp'),
      }),
    )
    .default(''),
  UDP_PORT: Joi.number().min(1).max(65535).empty('').default(-1),
  TCP_PORT: Joi.number().min(1).max(65535).empty('').default(-1),
  DOH_PORT: Joi.number().min(1).max(65535).empty('').default(-1),
  AUTH_TOKEN_EXPIRATION: Joi.number()
    .min(1)
    .max(byHours(100))
    .default(byHours(1)),
  ESCALATED_AUTH_TOKEN_EXPIRATION: Joi.number()
    .min(1)
    .max(byHours(100))
    .default(byMinutes(5)),
});

export enum ConfigKeys {
  SERVER_PORT = 'port',
  ENVIRONMENT = 'env',
  COOKIE_SECRET = 'cookie.secret',
  DATAPATH = 'data.path',
  FALLBACKS = 'fallbackServers',
  UDP_PORT = 'ports.udp',
  TCP_PORT = 'ports.tcp',
  DOH_PORT = 'ports.doh',
  AUTH_TOKEN_EXP = 'expirations.authToken',
  ESCALATED_AUTH_TOKEN_EXP = 'expirations.escalatedAuthToken',
}

export default ConfigModule.forRoot({
  envFilePath: ['.env', '.default.env'],
  load: [load],
  validationSchema: schema,
  validationOptions: {
    abortEarly: true,
  },
  cache: true,
});

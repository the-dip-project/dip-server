import * as Joi from 'joi';
import { resolve } from 'path';

import { Environments } from '@/common/constants/environments';
import { FallbackAddress } from '@/common/models/fallback-address';
import { ConfigModule } from '@nestjs/config';

export type Schema = {
  port: number;
  env: Environments;
  data: {
    path: string;
  };
  fallbackServers: Array<FallbackAddress>;
  ports: {
    udp: number;
    tcp: number;
    doh: number;
  };
};

function defaultDatapath(): string {
  return resolve(
    process.env.APPDATA ? process.env.APPDATA : process.env.HOME,
    '.dip',
    'data',
  );
}

const fallbacks = [];

function load(): Schema {
  const env = ['development', 'production'].indexOf(process.env.ENVIRONMENT);
  const datapath = !process.env.DATAPATH?.length
    ? defaultDatapath()
    : resolve(__dirname, process.env.DATAPATH);

  console.log(process.env);

  return {
    port: Number(process.env.PORT),
    env,
    data: { path: datapath },
    fallbackServers: fallbacks.map(({ ip, proto }) => ({
      ip,
      proto: proto ? proto : 'udp',
    })),
    ports: {
      udp: Number(process.env.UDP_PORT),
      tcp: Number(process.env.TCP_PORT),
      doh: Number(process.env.DOH_PORT),
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
  type: 'ipWProto',
  coerce: ((value) => {
    if (typeof value !== 'string') return value;

    const [ip, proto] = value.split('/');

    fallbacks.push({ ip, proto });

    return {
      value: { ip, proto },
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
      customJoi.ipWProto({
        ip: Joi.string().ip().required(),
        proto: Joi.string().valid('tcp', 'udp').default('udp'),
      }),
    )
    .default(''),
  UDP_PORT: Joi.number().min(1).max(65535).empty('').default(-1),
  TCP_PORT: Joi.number().min(1).max(65535).empty('').default(-1),
  DOH_PORT: Joi.number().min(1).max(65535).empty('').default(-1),
});

export enum ConfigKeys {
  SERVER_PORT = 'port',
  ENVIRONMENT = 'env',
  DATAPATH = 'data.path',
  FALLBACKS = 'fallbackServers',
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

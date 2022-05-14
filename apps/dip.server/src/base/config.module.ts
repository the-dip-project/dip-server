import * as Joi from 'joi';
import { resolve } from 'path';

import { Environments } from '@/common/constants/environments';
import { ConfigModule } from '@nestjs/config';

export type Schema = {
  port: number;
  env: Environments;
  data: {
    path: string;
  };
};

function defaultDatapath(): string {
  return resolve(
    process.env.APPDATA ? process.env.APPDATA : process.env.HOME,
    '.dip',
    'data',
  );
}

function load(): Schema {
  const env = ['development', 'production'].indexOf(process.env.ENVIRONMENT);
  const datapath = !process.env.DATAPATH?.length
    ? defaultDatapath()
    : resolve(__dirname, process.env.DATAPATH);

  return {
    port: Number(process.env.PORT),
    env,
    data: { path: datapath },
  };
}

const schema = Joi.object({
  PORT: Joi.number().min(1).max(65535).required(),
  ENVIRONMENT: Joi.string()
    .valid('development', 'production')
    .default('production'),
  DATAPATH: Joi.string()
    .allow(null, '')
    .pattern(
      /^(?:[a-z]:)?[\/\\]{0,2}(?:[.\/\\ ](?![.\/\\\n])|[^<>:"|?*.\/\\ \n])+$/,
    ),
});

export enum ConfigKeys {
  SERVER_PORT = 'port',
  ENVIRONMENT = 'env',
  DATAPATH = 'data.path',
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

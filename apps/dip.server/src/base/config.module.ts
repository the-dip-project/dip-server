import { Environments } from '@/common/constants/environments';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

export type Schema = {
  port: number;
  env: Environments;
};

function load(): Schema {
  const env = ['development', 'production'].indexOf(process.env.ENVIRONMENT);

  return {
    port: Number(process.env.PORT),
    env,
  };
}

const schema = Joi.object({
  PORT: Joi.number().min(1).max(65535).required(),
  ENVIRONMENT: Joi.string()
    .valid('development', 'production')
    .default('production'),
});

export enum ConfigKeys {
  SERVER_PORT = 'port',
  ENVIRONMENT = 'env',
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

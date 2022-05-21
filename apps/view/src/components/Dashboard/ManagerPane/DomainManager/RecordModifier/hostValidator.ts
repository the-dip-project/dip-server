import * as Joi from 'joi';
import { bySeconds } from '@/common/helpers/timespan';
import _debounce from 'lodash/debounce';

function joinDomain(sub: string, domain: string): string {
  return `${sub === '@' ? '' : sub + '.'}${domain}`;
}

const validator = Joi.string().domain().required();

export default _debounce(
  (
    originalValue: string,
    newValue: string,
    domain: string,
    callback: (result: string) => void,
  ) => {
    if (newValue.includes('.')) return callback(originalValue);

    const validation = validator.validate(joinDomain(newValue, domain));

    if (validation.error) return callback(originalValue);

    return callback(newValue);
  },
  bySeconds(0.5),
  { trailing: true },
);

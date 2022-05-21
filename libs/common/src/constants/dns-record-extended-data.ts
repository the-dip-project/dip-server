import { TYPE } from './dns-spec';

export const DnsRecordExtendedData = {
  [TYPE.MX]: {
    priority: 'number',
  },
  [TYPE.SRV]: {
    priority: 'number',
    weight: 'number',
    port: 'number',
  },
};

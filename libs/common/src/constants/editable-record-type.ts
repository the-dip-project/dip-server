import { TYPE } from './dns-spec';

export const EditableRecordTypes = [
  [TYPE.A, 'A'],
  [TYPE.AAAA, 'AAAA'],
  [TYPE.CNAME, 'CNAME'],
  [TYPE.MX, 'MX'],
  [TYPE.NS, 'NS'],
  [TYPE.PTR, 'PTR'],
  [TYPE.SOA, 'SOA'],
  [TYPE.SRV, 'SRV'],
  [TYPE.TXT, 'TXT'],
  [TYPE.CAA, 'CAA'],
];

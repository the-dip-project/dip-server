import { TYPE } from '@/common/constants/dns-spec';

import MxAdditional from './MxAdditional';
import SrvAdditional from './SrvAdditional';

export const AdditionalValue = {
  [TYPE.MX]: MxAdditional,
  [TYPE.SRV]: SrvAdditional,
};

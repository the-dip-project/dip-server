import { DomainEntity } from '../entities';

export type DomainListItem = Omit<DomainEntity, 'owner'> & {
  records: number;
};

import { DomainEntity } from '../entities';

export type DomainListItem = Omit<DomainEntity, 'owner' | 'ownerId'> & {
  records: number;
};

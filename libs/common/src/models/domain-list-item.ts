import { DomainEntity } from '../entities';

export type DomainListItem = Omit<
  DomainEntity,
  'owner' | 'ownerId' | 'creationDate'
> & {
  records: number;
  creationDate: number;
};

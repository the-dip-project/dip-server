import { DomainEntity, RecordEntity } from '@/common/entities';
import { DomainListItem } from '@/common/models/domain-list-item';
import { AnyAction } from 'redux';
import { ActionTypes } from '../../ActionTypes';

export type DomainState = {
  domains: DomainListItem[];
  domain: DomainEntity;
  records: RecordEntity[];
};

export const initialState: DomainState = {
  domains: [],
  domain: null,
  records: [],
};

export function reduce(state = initialState, action: AnyAction): DomainState {
  switch (action.type) {
    case ActionTypes.DOMAIN__SET_DOMAINS:
      return { ...state, domains: action.payload };

    case ActionTypes.DOMAIN__SET_DOMAIN:
      return { ...state, domain: action.payload };

    case ActionTypes.DOMAIN__SET_RECORDS:
      return { ...state, records: action.payload };

    default:
      return state;
  }
}

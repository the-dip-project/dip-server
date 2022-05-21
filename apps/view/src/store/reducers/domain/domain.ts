import { CLASS, TYPE } from '@/common/constants/dns-spec';
import { DomainEntity, RecordEntity } from '@/common/entities';
import { DomainListItem } from '@/common/models/domain-list-item';
import { AnyAction } from 'redux';
import { ActionTypes } from '../../ActionTypes';

export type DomainState = {
  domains: DomainListItem[];
  domain: DomainEntity;
  records: RecordEntity[];
  recordModifierPurpose: 'create' | 'update';
  editingRecord: RecordEntity;
};

const defaultRecord: RecordEntity = {
  id: undefined,
  host: '@',
  type: TYPE.A,
  class: CLASS.IN,
  data: '127.0.0.1',
  ttl: 3600,
  extendedData: '',
  domainId: 0,
  domain: null,
};

export const initialState: DomainState = {
  domains: [],
  domain: null,
  records: [],
  recordModifierPurpose: 'create',
  editingRecord: defaultRecord,
};

export function reduce(state = initialState, action: AnyAction): DomainState {
  switch (action.type) {
    case ActionTypes.DOMAIN__SET_DOMAINS:
      return { ...state, domains: action.payload };

    case ActionTypes.DOMAIN__SET_DOMAIN:
      return { ...state, domain: action.payload };

    case ActionTypes.DOMAIN__SET_RECORDS:
      return { ...state, records: action.payload };

    case ActionTypes.DOMAIN__SET_MOD_PURPOSE:
      return {
        ...state,
        recordModifierPurpose: action.payload,
      };

    default:
      return state;
  }
}

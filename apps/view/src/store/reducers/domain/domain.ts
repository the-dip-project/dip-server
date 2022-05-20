import { DomainListItem } from '@/common/models/domain-list-item';
import { AnyAction } from 'redux';
import { ActionTypes } from '../../ActionTypes';

export type DomainState = {
  domains: DomainListItem[];
};

export const initialState: DomainState = {
  domains: [],
};

export function reduce(state = initialState, action: AnyAction): DomainState {
  switch (action.type) {
    case ActionTypes.DOMAIN__SET_DOMAINS:
      return { ...state, domains: action.payload };

    default:
      return state;
  }
}

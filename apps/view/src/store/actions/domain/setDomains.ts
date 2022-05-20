import { DomainListItem } from '@/common/models/domain-list-item';
import { AppThunkAction, Action, ActionTypes } from '../..';

export function setDomains(
  domains: DomainListItem[],
): AppThunkAction<Action<DomainListItem[]>, void> {
  return (dispatch) =>
    dispatch({
      type: ActionTypes.DOMAIN__SET_DOMAINS,
      payload: domains,
    });
}

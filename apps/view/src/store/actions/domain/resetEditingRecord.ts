import { RecordEntity } from '@/common/entities';

import { Action, ActionTypes, AppThunkAction } from '../..';

export function resetEditingRecord(
  record: Partial<RecordEntity>,
): AppThunkAction<Action<Partial<RecordEntity>>, void> {
  return (dispatch) =>
    dispatch({
      type: ActionTypes.DOMAIN__RESET_EDITING_RECORD,
      payload: record,
    });
}

import { ConfirmCallback } from '@/view/common/types/ConfirmCallback';
import { DialogContentIndex } from '@/view/components/MasterDialog';

import { ActionTypes } from '../../ActionTypes';
import { Action, AppThunkAction } from '../../store';

export function confirm(
  callback: ConfirmCallback,
): AppThunkAction<Action<ConfirmCallback | number>, void> {
  return (dispatch) => (
    dispatch({
      type: ActionTypes.CONFIRM__SET_CALLBACK,
      payload: callback,
    }),
    dispatch({
      type: ActionTypes.APP__OPEN_DIALOG,
      payload: DialogContentIndex.CONFIRM_DIALOG,
    })
  );
}

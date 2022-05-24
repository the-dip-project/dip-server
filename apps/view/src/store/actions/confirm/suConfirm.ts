import { ConfirmCallback } from '@/view/common/types/ConfirmCallback';
import { DialogContentIndex } from '@/view/components/MasterDialog';

import { ActionTypes } from '../../ActionTypes';
import { Action, AppThunkAction } from '../../store';

export function suConfirm(
  callback: ConfirmCallback,
): AppThunkAction<Action<ConfirmCallback | number>, void> {
  return (dispatch) => (
    dispatch({
      type: ActionTypes.CONFIRM__SET_SU_CALLBACK,
      payload: callback,
    }),
    dispatch({
      type: ActionTypes.APP__OPEN_DIALOG,
      payload: DialogContentIndex.SU_CONFIRM_DIALOG,
    })
  );
}

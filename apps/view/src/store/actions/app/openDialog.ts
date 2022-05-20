import { DialogContentIndex } from '@/view/components/MasterDialog';

import { ActionTypes } from '../../ActionTypes';
import { Action, AppThunkAction } from '../../store';

export function openDialog(
  dialog: DialogContentIndex,
): AppThunkAction<Action<DialogContentIndex>, void> {
  return (dispatch) =>
    dispatch({
      type: ActionTypes.APP__OPEN_DIALOG,
      payload: dialog,
    });
}

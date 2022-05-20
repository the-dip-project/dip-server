import { ActionTypes } from '../../ActionTypes';
import { Action, AppThunkAction } from '../../store';

export function hideNotification(): AppThunkAction<Action<void>, void> {
  return (dispatch) =>
    dispatch({
      type: ActionTypes.APP__HIDE_NOTIFICATION,
      payload: undefined,
    });
}

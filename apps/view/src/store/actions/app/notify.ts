import { NotificationSeverity } from '@/view/common/types/Notification';

import { ActionTypes } from '../../ActionTypes';
import { Action, AppThunkAction } from '../../store';

export function notify(
  message: string,
  severity: NotificationSeverity = NotificationSeverity.INFO,
): AppThunkAction<Action<unknown>, void> {
  return (dispatch) =>
    dispatch({
      type: ActionTypes.APP__NOTIFY,
      payload: { message, severity },
    });
}

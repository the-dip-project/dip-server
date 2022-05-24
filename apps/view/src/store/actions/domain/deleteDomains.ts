import { ResponseDTO } from '@/common/models/dto/response.dto';
import { NotificationSeverity } from '@/view/common/types/Notification';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

import { Action, ActionTypes, AppThunkAction } from '../..';
import { notify } from '../app/notify';

type ActionType = Action<number[]> | AppThunkAction<unknown, void>;

export function deleteDomains(
  ...ids: number[]
): AppThunkAction<ActionType, void> {
  return async (dispatch) => {
    const { statusCode, message }: ResponseDTO<void> = await fetch(
      '/api/domain',
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids,
        }),
      },
    ).then((res) => res.json());

    switch (statusCode) {
      case HttpStatus.FORBIDDEN:
        return dispatch(notify(message.join(', '), NotificationSeverity.ERROR));

      default:
        break;
    }

    dispatch(
      notify(`${ids.length} domains deleted`, NotificationSeverity.SUCCESS),
    );
    dispatch({ type: ActionTypes.DOMAIN__DELETE_DOMAINS, payload: ids });
  };
}

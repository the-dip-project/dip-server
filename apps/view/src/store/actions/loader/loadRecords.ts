import { RecordEntity } from '@/common/entities';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { NotificationSeverity } from '@/view/common/types/Notification';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

import { Action, AppThunkAction, ActionTypes } from '../..';
import { notify } from '../app/notify';

export enum LoadRecordsResult {
  SUCCESS,
  INTERNAL_SERVER_ERROR,
  LOGGED_OUT,
}

export function loadRecords(
  domainId: number,
): AppThunkAction<
  Action<unknown> | AppThunkAction<unknown>,
  LoadRecordsResult
> {
  return async (dispatch) => {
    const { statusCode, message, body } = (await fetch(
      `/api/domain/${domainId}/record`,
    ).then((res) => res.json())) as ResponseDTO<RecordEntity[]>;

    switch (statusCode) {
      case HttpStatus.INTERNAL_SERVER_ERROR:
        dispatch(
          notify(
            typeof message === 'string' ? message : message.join(', '),
            NotificationSeverity.ERROR,
          ),
        );

        return LoadRecordsResult.INTERNAL_SERVER_ERROR;

      case HttpStatus.BAD_REQUEST:
        return LoadRecordsResult.LOGGED_OUT;

      default:
        break;
    }

    dispatch({
      type: ActionTypes.DOMAIN__SET_RECORDS,
      payload: body,
    });

    return LoadRecordsResult.SUCCESS;
  };
}

import { DomainListItem } from '@/common/models/domain-list-item';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { NotificationSeverity } from '@/view/common/types/Notification';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

import { Action, AppThunkAction } from '../..';
import { notify } from '../app/notify';
import { setDomains } from '../domain/setDomains';

export function loadDomains(): AppThunkAction<
  Action<unknown> | AppThunkAction<unknown>,
  void
> {
  return async (dispatch) => {
    const { statusCode, message, body } = (await fetch('/api/domain').then(
      (res) => res.json(),
    )) as ResponseDTO<DomainListItem[]>;

    switch (statusCode) {
      case HttpStatus.INTERNAL_SERVER_ERROR:
        dispatch(
          notify(
            typeof message === 'string' ? message : message.join(', '),
            NotificationSeverity.ERROR,
          ),
        );
        return;

      default:
        break;
    }

    dispatch(setDomains(body));
  };
}

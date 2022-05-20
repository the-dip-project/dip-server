import { DomainListItem } from '@/common/models/domain-list-item';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { NotificationSeverity } from '@/view/common/types/Notification';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

import { Action, AppThunkAction } from '../..';
import { notify } from '../app/notify';
import { setDomains } from '../domain/setDomains';

export enum LoadDomainsResult {
  SUCCESS,
  INTERNAL_SERVER_ERROR,
  LOGGED_OUT,
}

export function loadDomains(): AppThunkAction<
  Action<unknown> | AppThunkAction<unknown>,
  LoadDomainsResult
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

        return LoadDomainsResult.INTERNAL_SERVER_ERROR;

      case HttpStatus.BAD_REQUEST:
        return LoadDomainsResult.LOGGED_OUT;

      default:
        break;
    }

    dispatch(setDomains(body));

    return LoadDomainsResult.SUCCESS;
  };
}

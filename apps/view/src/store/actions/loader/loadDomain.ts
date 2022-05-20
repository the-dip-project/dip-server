import { DomainEntity } from '@/common/entities';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

import { Action, ActionTypes, AppThunkAction } from '../..';

export enum LoadDomainResult {
  SUCCESS,
  CAN_NOT_ACCESS,
  INVALID_DOMAIN,
  INTERNAL_SERVER_ERROR,
  LOGGED_OUT,
}

export function loadDomain(
  domainId: number,
): AppThunkAction<
  Action<DomainEntity> | AppThunkAction<unknown>,
  LoadDomainResult
> {
  return async (dispatch) => {
    const { statusCode, body, message }: ResponseDTO<DomainEntity> =
      await fetch(`/api/domain/${domainId}`).then((res) => res.json());

    switch (statusCode) {
      case HttpStatus.INTERNAL_SERVER_ERROR:
        console.error(
          `Error while loading domain #${domainId}: ${
            typeof message === 'string' ? message : message.join(', ')
          }`,
        );

        return LoadDomainResult.INTERNAL_SERVER_ERROR;

      case HttpStatus.NOT_FOUND:
      case HttpStatus.FORBIDDEN:
        return LoadDomainResult.CAN_NOT_ACCESS;

      case HttpStatus.BAD_REQUEST:
        if (message.includes('token')) return LoadDomainResult.LOGGED_OUT;
        else return LoadDomainResult.INVALID_DOMAIN;

      default:
        break;
    }

    dispatch({
      type: ActionTypes.DOMAIN__SET_DOMAIN,
      payload: body,
    });

    return LoadDomainResult.SUCCESS;
  };
}

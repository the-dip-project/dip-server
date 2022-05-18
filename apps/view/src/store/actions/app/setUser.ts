import { PublicUser } from '@/common/models/public-user';
import { ActionTypes } from '../../ActionTypes';
import { Action, AppThunkAction } from '../../store';

export function setUser(
  user: PublicUser,
): AppThunkAction<Action<PublicUser>, void> {
  return (dispatch) =>
    dispatch({
      type: ActionTypes.APP__SET_USER,
      payload: user,
    });
}

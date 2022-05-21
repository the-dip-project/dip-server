import { Action, AppThunkAction, ActionTypes } from '../..';

export function setModifierPurpose(
  purpose: 'create' | 'update',
): AppThunkAction<Action<'create' | 'update'>, void> {
  return (dispatch) =>
    dispatch({
      type: ActionTypes.DOMAIN__SET_MOD_PURPOSE,
      payload: purpose,
    });
}

import { AnyAction } from 'redux';

import { ConfirmCallback } from '@/view/common/types/ConfirmCallback';
import { ActionTypes } from '../../ActionTypes';

export type ConfirmState = {
  callback: ConfirmCallback;
};

export const initialState: ConfirmState = {
  callback: () => {
    return;
  },
};

export function reduce(state = initialState, action: AnyAction): ConfirmState {
  switch (action.type) {
    case ActionTypes.CONFIRM__SET_CALLBACK:
      return { ...state, callback: action.payload };

    default:
      return state;
  }
}

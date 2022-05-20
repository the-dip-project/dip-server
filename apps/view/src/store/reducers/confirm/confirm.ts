import { AnyAction } from 'redux';

import { ConfirmCallback } from '@/view/common/types/ConfirmCallback';

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
    default:
      return state;
  }
}

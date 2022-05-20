import { AnyAction } from 'redux';

import { PublicUser } from '@/common/models/public-user';
import {
  Notification,
  NotificationSeverity,
} from '@/view/common/types/Notification';

import { ActionTypes } from '../../ActionTypes';

export type AppState = {
  user: PublicUser;
  notification: Notification;
};

export const initialState: AppState = {
  user: null,
  notification: {
    open: false,
    message: '',
    severity: NotificationSeverity.INFO,
  },
};

export function reduce(state = initialState, action: AnyAction): AppState {
  switch (action.type) {
    case ActionTypes.APP__SET_USER:
      return { ...state, user: action.payload };

    case ActionTypes.APP__NOTIFY:
      return { ...state, notification: { open: true, ...action.payload } };

    default:
      return state;
  }
}

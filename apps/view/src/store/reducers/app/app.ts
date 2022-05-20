import { AnyAction } from 'redux';

import { PublicUser } from '@/common/models/public-user';
import { Dialog } from '@/view/common/types/Dialog';
import {
  Notification,
  NotificationSeverity,
} from '@/view/common/types/Notification';
import { DialogContentIndex } from '@/view/components/MasterDialog';

import { ActionTypes } from '../../ActionTypes';

export type AppState = {
  user: PublicUser;
  notification: Notification;
  dialog: Dialog;
};

export const initialState: AppState = {
  user: null,
  notification: {
    open: false,
    message: '',
    severity: NotificationSeverity.INFO,
  },
  dialog: {
    contentIndex: DialogContentIndex.NONE,
  },
};

export function reduce(state = initialState, action: AnyAction): AppState {
  switch (action.type) {
    case ActionTypes.APP__SET_USER:
      return { ...state, user: action.payload };

    case ActionTypes.APP__NOTIFY:
      return { ...state, notification: { open: true, ...action.payload } };

    case ActionTypes.APP__HIDE_NOTIFICATION:
      return { ...state, notification: { ...state.notification, open: false } };

    case ActionTypes.APP__OPEN_DIALOG:
      return { ...state, dialog: { contentIndex: action.payload } };

    default:
      return state;
  }
}

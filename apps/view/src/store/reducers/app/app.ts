import { PublicUser } from '@/common/models/public-user';
import { AnyAction } from 'redux';
import { ActionTypes } from '../../ActionTypes';

export type AppState = {
  user: PublicUser;
};

export const initialState: AppState = {
  user: null,
};

export function reduce(state = initialState, action: AnyAction): AppState {
  switch (action.type) {
    case ActionTypes.APP__SET_USER:
      return { ...state, user: action.payload };

    default:
      return state;
  }
}

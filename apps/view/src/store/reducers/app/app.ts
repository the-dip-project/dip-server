import { PublicUser } from '@/common/models/public-user';
import { AnyAction } from 'redux';

export type AppState = {
  user: PublicUser;
};

export const initialState: AppState = {
  user: null,
};

export function reduce(state = initialState, action: AnyAction): AppState {
  switch (action.type) {
    default:
      return state;
  }
}

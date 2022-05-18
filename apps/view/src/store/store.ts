import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { ActionTypes } from './ActionTypes';

const store = configureStore({
  reducer: {},
  preloadedState: {},
  middleware(getDefaultMiddleware) {
    return [...getDefaultMiddleware(), thunk];
  },
  devTools: process.env.NODE_ENV === 'development',
});

export type ApplicationState = ReturnType<typeof store.getState>;
export type GetState = () => ApplicationState;
export type Action<PayloadType> = {
  type: ActionTypes;
  payload: PayloadType;
};

export interface AppThunkAction<TAction, TResult = void> {
  (dispatch: (action: TAction) => void, getState: GetState):
    | TResult
    | PromiseLike<TResult>;
}

export default store;

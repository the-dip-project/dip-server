import { initialState, reduce } from './app';

export * from './app';
export default {
  reducer: {
    app: reduce,
  },
  preloadedState: {
    app: initialState,
  },
};

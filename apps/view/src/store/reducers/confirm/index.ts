import { initialState, reduce } from './confirm';

export * from './confirm';
export default {
  reducer: {
    confirm: reduce,
  },
  preloadedState: {
    confirm: initialState,
  },
};

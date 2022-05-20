import { initialState, reduce } from './domain';

export * from './domain';
export default {
  reducer: {
    domain: reduce,
  },
  preloadedState: {
    domain: initialState,
  },
};

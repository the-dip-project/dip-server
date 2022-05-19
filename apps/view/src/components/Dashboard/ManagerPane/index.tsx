import { Route } from 'react-router';

import ManagerPane, { meta } from './ManagerPane';

export const route = (
  <Route path={meta.path.replace(/^\//, '')} element={<ManagerPane />} />
);

export * from './ManagerPane';

import { Route } from 'react-router';

import ManagerPane, { meta } from './ManagerPane';

export const route = (
  <Route path={meta.path.replace(/^\//, '')} element={<ManagerPane />}>
    <Route path=":domainId" element={<ManagerPane />} />
  </Route>
);

export * from './ManagerPane';

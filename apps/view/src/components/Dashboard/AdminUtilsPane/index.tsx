import { Route } from 'react-router';

import AdminUtilsPane, { meta } from './AdminUtilsPane';

export const route = (
  <Route path={meta.path.replace(/^\//, '')} element={<AdminUtilsPane />} />
);

export * from './AdminUtilsPane';

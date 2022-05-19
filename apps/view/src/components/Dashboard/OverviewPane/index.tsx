import { Route } from 'react-router';

import OverviewPane, { meta } from './OverviewPane';

export const route = (
  <Route path={meta.path.replace(/^\//, '')} element={<OverviewPane />} />
);

export * from './OverviewPane';

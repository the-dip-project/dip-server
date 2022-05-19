import { Route } from 'react-router';

import ProfilePane, { meta } from './ProfilePane';

export const route = (
  <Route path={meta.path.replace(/^\//, '')} element={<ProfilePane />} />
);

export * from './ProfilePane';

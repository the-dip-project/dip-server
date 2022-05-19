import { useSelector } from '@/view/hooks/useSelector';
import { ApplicationState } from '@/view/store';
import { AdminPanelSettings } from '@mui/icons-material';
import { Portal } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';
import { Navigate } from 'react-router';

import { IMenuEntry } from '../IMenuEntry';
import { PaneRegister } from '../Panes';

export const meta: IMenuEntry = {
  order: 4,
  icon: <AdminPanelSettings />,
  label: 'Admin utilities',
  path: '/sudo',
  minPrivilege: 0,
};

PaneRegister.getInstance().register(meta);

const connector = connect(
  (state: ApplicationState) => ({
    role: state.app.user?.role,
  }),
  {},
);

function AdminUtilsPane({ role }: ConnectedProps<typeof connector>) {
  const container = useSelector('#main')[0];

  if (role > meta.minPrivilege) return <Navigate to="/" />;

  return <Portal container={container}>Admin utilities</Portal>;
}

export default connector(AdminUtilsPane);

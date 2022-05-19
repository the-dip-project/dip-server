import { useSelector } from '@/view/hooks/useSelector';
import { Dns } from '@mui/icons-material';
import { Portal } from '@mui/material';

import { IMenuEntry } from '../IMenuEntry';
import { PaneRegister } from '../Panes';

export const meta: IMenuEntry = {
  order: 2,
  icon: <Dns />,
  label: 'Manage domains',
  path: '/manage',
  minPrivilege: Number.MAX_SAFE_INTEGER,
};

PaneRegister.getInstance().register(meta);

function ManagerPane() {
  const container = useSelector('#main')[0];

  return <Portal container={container}>Manager</Portal>;
}

export default ManagerPane;

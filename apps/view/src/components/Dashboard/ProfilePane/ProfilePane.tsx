import { useSelector } from '@/view/hooks/useSelector';
import { ManageAccounts } from '@mui/icons-material';
import { Portal } from '@mui/material';

import { IMenuEntry } from '../IMenuEntry';
import { PaneRegister } from '../Panes';

export const meta: IMenuEntry = {
  order: 3,
  icon: <ManageAccounts />,
  label: 'Edit profile',
  path: '/profile',
  minPrivilege: Number.MAX_SAFE_INTEGER,
};

PaneRegister.getInstance().register(meta);

function ProfilePane() {
  const container = useSelector('#main')[0];

  return <Portal container={container}>Profile</Portal>;
}

export default ProfilePane;

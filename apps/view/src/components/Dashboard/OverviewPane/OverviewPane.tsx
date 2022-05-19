import { useSelector } from '@/view/hooks/useSelector';
import { Speed } from '@mui/icons-material';
import { Portal } from '@mui/material';

import { IMenuEntry } from '../IMenuEntry';
import { PaneRegister } from '../Panes';

export const meta: IMenuEntry = {
  order: 1,
  icon: <Speed />,
  label: 'Overview',
  path: '/overview',
  minPrivilege: Number.MAX_SAFE_INTEGER,
};

PaneRegister.getInstance().register(meta);

function OverviewPane() {
  const container = useSelector('#main')[0];

  return <Portal container={container}>Overview</Portal>;
}

export default OverviewPane;

import { useSelector } from '@/view/hooks/useSelector';
import styled from '@emotion/styled';
import { ManageAccounts } from '@mui/icons-material';
import { Divider, Portal, Typography } from '@mui/material';

import { IMenuEntry } from '../IMenuEntry';
import { PaneRegister } from '../Panes';
import DangerZone from './DangerZone/DangerZone';
import NormalZone from './NormalZone/NormalZone';

export const meta: IMenuEntry = {
  order: 3,
  icon: <ManageAccounts />,
  label: 'Edit profile',
  path: '/profile',
  minPrivilege: Number.MAX_SAFE_INTEGER,
};

PaneRegister.getInstance().register(meta);

const Root = styled.div`
  padding: 2rem;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

function ProfilePane() {
  const container = useSelector('#main')[0];

  return (
    <Portal container={container}>
      <Root>
        <Typography variant="h4">Edit your profile</Typography>

        <br />

        <Divider />

        <br />

        <NormalZone />

        <br />

        <Divider />

        <br />

        <DangerZone />
      </Root>
    </Portal>
  );
}

export default ProfilePane;

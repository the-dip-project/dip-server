import NowrapTypo from '@/view/common/components/NowrapTypo';
import { useSelector } from '@/view/hooks/useSelector';
import styled from '@emotion/styled';
import { Speed } from '@mui/icons-material';
import { Divider, Portal, Typography } from '@mui/material';

import { IMenuEntry } from '../IMenuEntry';
import { PaneRegister } from '../Panes';
import ApiKey from './ApiKey/ApiKey';
import Instruction from './Instruction/Instruction';

export const meta: IMenuEntry = {
  order: 1,
  icon: <Speed />,
  label: 'Overview',
  path: '/overview',
  minPrivilege: Number.MAX_SAFE_INTEGER,
};

PaneRegister.getInstance().register(meta);

const Root = styled.div`
  padding: 2rem;
  height: 100%;
  overflow-y: auto;
`;

function OverviewPane() {
  const container = useSelector('#main')[0];

  return (
    <Portal container={container}>
      <Root>
        <NowrapTypo
          variant="h4"
          maxWidth="100%"
          textOverflow="ellipsis"
          overflow="hidden"
        >
          Overview
        </NowrapTypo>

        <br />

        <Divider />

        <ApiKey />
        <Instruction />

        <br />

        <Typography variant="caption" color="gray">
          For further information, please use help command.
        </Typography>
      </Root>
    </Portal>
  );
}

export default OverviewPane;

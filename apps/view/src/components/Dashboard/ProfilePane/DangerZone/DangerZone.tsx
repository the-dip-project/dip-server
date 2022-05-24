import styled from '@emotion/styled';
import { List, Paper, Typography } from '@mui/material';

import DeleteAccountAction from './DeleteAccountAction/DeleteAccountAction';
import GenerateNewSecretAction from './GenerateNewSecretAction/GenerateNewSecretAction';

const Root = styled(Paper)`
  padding: 0.8rem 2rem;
  border: 3px dashed #dc3545;
`;

function DangerZone() {
  return (
    <Root elevation={0}>
      <List>
        <GenerateNewSecretAction />

        <DeleteAccountAction />
      </List>

      <Typography
        variant="caption"
        color="gray"
        align="right"
        width="100%"
        display="block"
      >
        These are irreversible actions
      </Typography>
    </Root>
  );
}

export default DangerZone;

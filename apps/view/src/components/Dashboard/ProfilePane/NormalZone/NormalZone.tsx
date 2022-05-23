import { useEffect, useRef } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { RoleNames } from '@/common/constants/roles';
import Flexbox from '@/view/common/components/Flexbox';
import Grid from '@/view/common/components/Grid';
import { ApplicationState } from '@/view/store';
import styled from '@emotion/styled';
import {
  Button,
  Divider,
  FilledInput,
  FormControl,
  InputLabel,
  Paper,
  Typography,
} from '@mui/material';

import ChangePassword from './ChangePassword/ChangePassword';

const Root = styled(Paper)`
  padding: 2rem;
`;

const NameZoneGrid = styled(Grid)`
  width: 100%;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0px 0.5rem;
  grid-template-areas: 'edit-username edit-username edit-display-name edit-display-name edit-display-name';
`;

const EditUsername = styled(FormControl)`
  grid-area: edit-username;
`;

const EditDisplayName = styled(FormControl)`
  grid-area: edit-display-name;
`;

const connector = connect(
  (state: ApplicationState) => ({
    username: state.app.user?.username ?? '',
    displayName: state.app.user?.displayName ?? '',
    role: state.app.user?.role ?? -1,
  }),
  {},
);

function NormalZone({
  username,
  displayName,
  role,
}: ConnectedProps<typeof connector>) {
  const displayNameInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    const { current } = displayNameInputRef;

    if (!current) return;

    current.value = displayName;
    current.focus();
    current.blur();
  }, [displayName]);

  return (
    <Root>
      <Typography fontWeight="bold">You are {RoleNames[role]}</Typography>

      <br />

      <Divider />

      <br />

      <NameZoneGrid>
        <EditUsername size="small" disabled variant="filled">
          <InputLabel>Username</InputLabel>
          <FilledInput value={username} />
        </EditUsername>

        <br />

        <EditDisplayName size="small" variant="filled">
          <InputLabel>Display name</InputLabel>
          <FilledInput />
        </EditDisplayName>
      </NameZoneGrid>

      <Divider />

      <br />

      <ChangePassword />

      <Flexbox style={{ width: '100%', justifyContent: 'flex-end' }}>
        <Button variant="contained">save</Button>
      </Flexbox>
    </Root>
  );
}

export default connector(NormalZone);

import NowrapTypo from '@/view/common/components/NowrapTypo';
import TransparentAvatar from '@/view/common/components/TransparentAvatar';
import { ApplicationState } from '@/view/store';
import styled from '@emotion/styled';
import { AccountCircle } from '@mui/icons-material';
import { List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';

const Root = styled.div`
  padding-top: 1rem;
  width: 100%;
`;

const ButtonTypo = styled(NowrapTypo)`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

const connector = connect(
  (state: ApplicationState) => ({
    user: state.app.user,
  }),
  {},
);

function UserInfo({ user }: ConnectedProps<typeof connector>) {
  if (!user) return null;

  const handleLogout = async () => {
    await fetch('/api/user/logout', { method: 'POST' }).then((res) => res.json);

    window.location.reload();
  };

  return (
    <Root>
      <List>
        <ListItem>
          <ListItemAvatar>
            <TransparentAvatar>
              <AccountCircle />
            </TransparentAvatar>
          </ListItemAvatar>

          <ListItemText
            primary={
              <NowrapTypo variant="body2">{user.displayName}</NowrapTypo>
            }
            secondary={
              <ButtonTypo variant="caption" onClick={handleLogout}>
                <b>Log out</b>
              </ButtonTypo>
            }
          />
        </ListItem>
      </List>
    </Root>
  );
}

export default connector(UserInfo);

import { connect, ConnectedProps } from 'react-redux';

import { ApplicationState } from '@/view/store';
import { Delete } from '@mui/icons-material';
import {
  Button,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';

const maxTextWidth = 'calc(100% - 12.5rem)';

const connector = connect((state: ApplicationState) => ({
  role: state.app.user?.role ?? -1,
}));

function DeleteAccountAction({ role }: ConnectedProps<typeof connector>) {
  const disabled = role === 0;

  return (
    <ListItem disabled={disabled} divider>
      <ListItemText
        primary={
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            maxWidth={maxTextWidth}
          >
            Delete account: You can no longer use this account
          </Typography>
        }
        secondary={
          <Typography variant="subtitle2" color="gray" maxWidth={maxTextWidth}>
            All registered domains will also be deleted. This action is disabled
            for root user.
          </Typography>
        }
      />

      <ListItemSecondaryAction>
        <Button
          variant="contained"
          size="small"
          color="error"
          disabled={disabled}
        >
          <Delete />
          &nbsp;&nbsp;delete this account
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default connector(DeleteAccountAction);

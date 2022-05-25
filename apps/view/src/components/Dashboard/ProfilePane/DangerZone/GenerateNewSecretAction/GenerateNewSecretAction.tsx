import { connect, ConnectedProps } from 'react-redux';

import { suConfirm } from '@/view/store/actions/confirm/suConfirm';
import { Refresh } from '@mui/icons-material';
import {
  Button,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

const maxTextWidth = 'calc(100% - 11rem)';

const connector = connect(() => ({}), {
  suConfirm,
});

function GenerateNewSecretAction({
  suConfirm,
}: ConnectedProps<typeof connector>) {
  const handleClick = () => {
    suConfirm(async (accepted) => {
      if (!accepted) return;

      const { statusCode } = await fetch('/api/user/me/secret', {
        method: 'POST',
      }).then((res) => res.json());

      if (statusCode === HttpStatus.CREATED) window.location.reload();
    });
  };

  return (
    <ListItem divider>
      <ListItemText
        primary={
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            maxWidth={maxTextWidth}
          >
            Generate new secret: You will be kicked out of current session
          </Typography>
        }
        secondary={
          <Typography variant="subtitle2" color="gray" maxWidth={maxTextWidth}>
            If your tokens were exposed, you can generate new secret.
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Button
          variant="contained"
          size="small"
          color="error"
          onClick={handleClick}
        >
          <Refresh />
          &nbsp;&nbsp;generate secret
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default connector(GenerateNewSecretAction);

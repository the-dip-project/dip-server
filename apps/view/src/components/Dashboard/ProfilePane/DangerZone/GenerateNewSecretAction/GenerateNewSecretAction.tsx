import { Refresh } from '@mui/icons-material';
import {
  Button,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';

const maxTextWidth = 'calc(100% - 11rem)';

function GenerateNewSecretAction() {
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
        <Button variant="contained" size="small" color="error">
          <Refresh />
          &nbsp;&nbsp;generate secret
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default GenerateNewSecretAction;

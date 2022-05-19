import { Delete } from '@mui/icons-material';
import {
  Button,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  Typography,
} from '@mui/material';

const maxTextWidth = 'calc(100% - 10.5rem)';

function DeleteAllDomainsAction() {
  return (
    <ListItem>
      <ListItemText
        primary={
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            maxWidth={maxTextWidth}
          >
            Delete all domains: Every domains registered by your account will be
            deleted
          </Typography>
        }
      />
      <ListItemSecondaryAction>
        <Button variant="contained" size="small" color="error">
          <Delete />
          &nbsp;&nbsp;delete domain
        </Button>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default DeleteAllDomainsAction;

import { connect, ConnectedProps } from 'react-redux';

import { ApplicationState } from '@/view/store';
import { openDialog } from '@/view/store/actions/app/openDialog';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';

import { DialogContentIndex } from '../DialogContents';

const connector = connect(
  (state: ApplicationState) => ({
    callback: state.confirm.callback,
  }),
  {
    openDialog,
  },
);

function ConfirmDialog({
  callback,
  openDialog,
}: ConnectedProps<typeof connector>) {
  const handleClick = (ok) => {
    openDialog(DialogContentIndex.NONE);
    callback(ok);
  };

  return (
    <>
      <DialogTitle>Confirm</DialogTitle>

      <DialogContent>
        This action is irreversible. Are you sure to proceed?
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClick.bind(null, true)}>Proceed</Button>

        <Button variant="contained" onClick={handleClick.bind(null, false)}>
          Cancel
        </Button>
      </DialogActions>
    </>
  );
}

export default connector(ConfirmDialog);

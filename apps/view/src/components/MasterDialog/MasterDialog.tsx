import { connect, ConnectedProps } from 'react-redux';

import { ApplicationState } from '@/view/store';
import { openDialog } from '@/view/store/actions/app/openDialog';
import { Dialog } from '@mui/material';

import { DialogContentIndex, DialogContents } from './DialogContents';

const connector = connect(
  (state: ApplicationState) => ({
    contentIndex: state.app.dialog.contentIndex,
  }),
  {
    openDialog,
  },
);

function MasterDialog({
  contentIndex,
  openDialog,
}: ConnectedProps<typeof connector>) {
  return (
    <Dialog
      open={contentIndex !== DialogContentIndex.NONE}
      onClose={() => openDialog(DialogContentIndex.NONE)}
    >
      {DialogContents[contentIndex]}
    </Dialog>
  );
}

export default connector(MasterDialog);

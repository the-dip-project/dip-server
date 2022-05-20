import { connect, ConnectedProps } from 'react-redux';

import { ApplicationState } from '@/view/store';
import { Alert, Slide, SlideProps, Snackbar } from '@mui/material';

function Transition(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

const connector = connect(
  (state: ApplicationState) => ({
    notification: state.app.notification,
  }),
  {},
);

function Notificator({ notification }: ConnectedProps<typeof connector>) {
  const { open, severity, message } = notification;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open}
      TransitionComponent={Transition}
    >
      <Alert variant="filled" severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );
}

export default connector(Notificator);

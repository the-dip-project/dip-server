import { connect, ConnectedProps } from 'react-redux';

import { ApplicationState } from '@/view/store';
import { Alert, IconButton, Slide, SlideProps, Snackbar } from '@mui/material';
import { bySeconds } from '@/common/helpers/timespan';
import { hideNotification } from '@/view/store/actions/app/hideNotification';
import { ChatBubble, Check, Close, Warning } from '@mui/icons-material';

function Transition(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

const connector = connect(
  (state: ApplicationState) => ({
    notification: state.app.notification,
  }),
  {
    hideNotification,
  },
);

function Notificator({
  notification,
  hideNotification,
}: ConnectedProps<typeof connector>) {
  const { open, severity, message } = notification;

  return (
    <Snackbar
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      open={open}
      autoHideDuration={bySeconds(3)}
      onClose={hideNotification}
      TransitionComponent={Transition}
    >
      <Alert
        variant="filled"
        severity={severity}
        iconMapping={{
          success: <Check fontSize="inherit" />,
          error: <Close fontSize="inherit" />,
          warning: <Warning fontSize="inherit" />,
          info: <ChatBubble fontSize="inherit" />,
        }}
        action={
          <IconButton size="small" onClick={hideNotification}>
            <Close fontSize="inherit" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default connector(Notificator);

import { connect, ConnectedProps } from 'react-redux';

import { ApplicationState } from '@/view/store';
import { openDialog } from '@/view/store/actions/app/openDialog';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FilledInput,
  FormControl,
  FormHelperText,
  InputLabel,
  Typography,
} from '@mui/material';

import { DialogContentIndex } from '../DialogContents';
import { useRef, useState } from 'react';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { useNavigate } from 'react-router';
import { notify } from '@/view/store/actions/app/notify';
import { NotificationSeverity } from '@/view/common/types/Notification';
import { generateAnswer } from '@/common/helpers/generate-answer';

const connector = connect(
  (state: ApplicationState) => ({
    username: state.app.user.username,
    escalatedUntil: state.app.user?.escalatedUntil ?? 0,
    callback: state.confirm.suCallback,
  }),
  {
    openDialog,
    notify,
  },
);

function SuConfirmDialog({
  username,
  escalatedUntil,
  callback,
  openDialog,
  notify,
}: ConnectedProps<typeof connector>) {
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const escalated = escalatedUntil > Date.now();

  const handleClick = async (accepted) => {
    if (escalatedUntil > Date.now()) {
      openDialog(DialogContentIndex.NONE);
      callback(accepted);

      return;
    }

    if (!passwordRef.current) return;

    if (!accepted) {
      openDialog(DialogContentIndex.NONE);
      callback(accepted);

      return;
    }

    const { statusCode: statusCode0, body: question }: ResponseDTO<string> =
      await fetch(`/api/user/login?username=${username}`).then((res) =>
        res.json(),
      );

    switch (statusCode0) {
      case HttpStatus.NOT_FOUND:
        return navigate('/login');

      case HttpStatus.INTERNAL_SERVER_ERROR:
        return notify('Internal server error', NotificationSeverity.ERROR);

      default:
        break;
    }

    const { statusCode: statusCode1, message: message1 }: ResponseDTO<void> =
      await fetch('/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: generateAnswer(question, passwordRef.current.value, {
            hashPassword: true,
          }),
          escalate: true,
        }),
      }).then((res) => res.json());

    switch (statusCode1) {
      case HttpStatus.NOT_FOUND:
        return navigate('/login');

      case HttpStatus.BAD_REQUEST: {
        if (!message1[0].includes('answer')) return;

        setError('Incorrect password');
        return;
      }

      case HttpStatus.INTERNAL_SERVER_ERROR:
        return notify('Internal server error', NotificationSeverity.ERROR);

      default:
        break;
    }

    openDialog(DialogContentIndex.NONE);
    await callback(accepted);
    window.location.reload();
  };

  return (
    <>
      <DialogTitle>Confirm</DialogTitle>

      <DialogContent>
        <Typography>
          This action is marked as dangerous. Password is required to continue.
        </Typography>

        <br />

        <FormControl
          variant="filled"
          error={error.length !== 0}
          fullWidth
          disabled={escalated}
        >
          <InputLabel>
            {escalated ? 'You are escalated' : 'Password'}
          </InputLabel>

          <FilledInput inputRef={passwordRef} type="password" />

          <FormHelperText>{error}</FormHelperText>
        </FormControl>
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

export default connector(SuConfirmDialog);

import { SyntheticEvent, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate } from 'react-router';

import { generateAnswer } from '@/common/helpers/generate-answer';
import { bySeconds } from '@/common/helpers/timespan';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { NotificationSeverity } from '@/view/common/types/Notification';
import { breakpoints } from '@/view/constants/breakpoints';
import { notify } from '@/view/store/actions/app/notify';
import styled from '@emotion/styled';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

const Root = styled(Paper)`
  height: 100%;
  width: 32rem;
  min-width: 26rem;
  display: flex;
  display: flexbox;
  display: -ms-flexbox;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: flex-start;

  @media (max-width: ${breakpoints.values.md}px) {
    width: 100%;
    max-width: none;
  }
`;

const Form = styled.form`
  padding: 3rem 2rem 1rem 2rem;
  flex: 1;
`;

const FormInputs = styled.div`
  padding: 3rem 0;
  height: 14rem;
  display: flex;
  display: flexbox;
  display: -ms-flexbox;
  display: -webkit-flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Info = styled.div`
  background-color: #ededed;
  width: 100%;
  padding: 1.5rem 2rem;
`;

const connector = connect(() => ({}), {
  notify,
});

function LoginForm({ notify }: ConnectedProps<typeof connector>) {
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: SyntheticEvent) => {
    event.preventDefault();

    if (loggingIn) return;
    setLoggingIn(true);

    let navigated = false;

    await (async () => {
      const { target: form } = event;
      const {
        username: { value: username },
        password: { value: password },
      } = form as any;

      const {
        statusCode: statusCode0,
        message: message0,
        body,
      } = (await fetch(`/api/user/login?username=${username}`).then((res) =>
        res.json(),
      )) as ResponseDTO<string>;

      switch (statusCode0) {
        case HttpStatus.NOT_FOUND:
          notify('User does not exists', NotificationSeverity.WARNING);
          return;

        case HttpStatus.INTERNAL_SERVER_ERROR:
          notify(
            typeof message0 === 'string' ? message0 : message0.join('. '),
            NotificationSeverity.ERROR,
          );
          return;

        default:
          break;
      }

      const answer = generateAnswer(body, password, { hashPassword: true });

      const { statusCode: statusCode1, message: message1 } = await fetch(
        '/api/user/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answer }),
        },
      ).then((res) => res.json());

      switch (statusCode1) {
        case HttpStatus.NOT_ACCEPTABLE:
          notify('Wrong password', NotificationSeverity.WARNING);
          return;

        case HttpStatus.INTERNAL_SERVER_ERROR:
          notify(
            typeof message1 === 'string' ? message1 : message1.join('. '),
            NotificationSeverity.ERROR,
          );
          return;
      }

      notify('Logged in successfully', NotificationSeverity.SUCCESS);

      setTimeout(() => navigate('/'), bySeconds(1));

      navigated = true;
    })();

    if (!navigated) setLoggingIn(false);
  };

  return (
    <Root elevation={4} onSubmit={handleSubmit}>
      <Form>
        <Typography variant="h4">DIP - Dynamic IP</Typography>

        <FormInputs>
          <TextField
            size="small"
            variant="filled"
            fullWidth
            disabled={loggingIn}
            label="Username"
            name="username"
          />

          <TextField
            size="small"
            variant="filled"
            fullWidth
            disabled={loggingIn}
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormInputs>

        <div style={{ width: '100%', direction: 'rtl' }}>
          <Button variant="contained" disabled={loggingIn} type="submit">
            {loggingIn ? <CircularProgress size={24} /> : <b>log in</b>}
          </Button>
        </div>
      </Form>

      <Info>
        <b>Server: {window['__SERVER_DATA__'].server}</b>
        <p>Log in with your user account.</p>
      </Info>
    </Root>
  );
}

export default connector(LoginForm);

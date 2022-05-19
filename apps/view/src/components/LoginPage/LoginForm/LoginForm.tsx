import { SyntheticEvent, useState } from 'react';
import { useNavigate } from 'react-router';

import { generateAnswer } from '@/common/helpers/generate-answer';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { breakpoints } from '@/view/constants/breakpoints';
import styled from '@emotion/styled';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Alert,
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
  padding: 3rem 2rem 0 2rem;
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

const FloatingContainer = styled.div`
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  max-width: calc(100vw - 4rem);
`;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState('');

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

      if (statusCode0 !== HttpStatus.OK) {
        setError(typeof message0 === 'string' ? message0 : message0.join('. '));
        return;
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

      if (statusCode1 !== HttpStatus.OK) {
        setError(typeof message1 === 'string' ? message1 : message1.join('. '));
        return;
      }

      navigate('/');
      navigated = true;
    })();

    if (!navigated) setLoggingIn(false);
  };

  return (
    <Root elevation={4} onSubmit={handleSubmit}>
      {error.length !== 0 ? (
        <FloatingContainer>
          <Alert severity="error" onClose={() => setError('')}>
            {error}
          </Alert>
        </FloatingContainer>
      ) : null}

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

export default LoginForm;

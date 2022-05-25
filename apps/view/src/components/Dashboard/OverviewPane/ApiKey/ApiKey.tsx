import { useRef, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { bySeconds } from '@/common/helpers/timespan';
import { ApplicationState } from '@/view/store';
import styled from '@emotion/styled';
import { ContentCopy, Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Tooltip,
} from '@mui/material';
import Flexbox from '@/view/common/components/Flexbox';

const Root = styled(Paper)`
  padding: 1rem 1rem;
  margin-top: 2rem;
`;

const GenNewBtnContainer = styled(Flexbox)`
  margin-top: 1rem;
  flex-direction: row;
  -ms-flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const connector = connect(
  (state: ApplicationState) => ({
    apiKey: state.app.user?.apiKey ?? '',
  }),
  {},
);

function ApiKey({ apiKey }: ConnectedProps<typeof connector>) {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState('Copy to clipboard');
  const inputRef = useRef<HTMLInputElement>(null);

  const copy = () => {
    if (!inputRef.current) return;

    const input = inputRef.current;

    input.select();
    input.setSelectionRange(0, apiKey.length);

    try {
      if ('clipboard' in navigator) {
        // using clipboard api
        navigator.clipboard.writeText(input.value);
      } else {
        // fallback to document execCommand
        document.execCommand('copy');
      }
    } catch (err) {}

    setTitle('Copied!');

    setTimeout(() => {
      setTitle('Copy to clipboard');
    }, bySeconds(2));
  };

  return (
    <Root>
      <input
        hidden
        style={{ display: 'none' }}
        value={apiKey}
        readOnly
        ref={inputRef}
      />

      <TextField
        variant="filled"
        label={
          <>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;API
            Key
          </>
        }
        fullWidth
        type={show ? 'text' : 'password'}
        value={apiKey}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start">
              <IconButton size="small" onClick={() => setShow(!show)}>
                {show ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <Tooltip title={title}>
                <IconButton size="small" onClick={copy}>
                  <ContentCopy />
                </IconButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />

      <GenNewBtnContainer>
        <Tooltip title="Old key will be unusable">
          <Button color="error" variant="contained">
            generate new key
          </Button>
        </Tooltip>
      </GenNewBtnContainer>
    </Root>
  );
}

export default connector(ApiKey);

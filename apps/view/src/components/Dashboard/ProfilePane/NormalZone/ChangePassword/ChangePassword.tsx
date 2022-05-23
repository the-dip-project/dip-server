import { useState } from 'react';

import Grid from '@/view/common/components/Grid';
import styled from '@emotion/styled';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  FilledInput,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
} from '@mui/material';

const ChangePasswordGrid = styled(Grid)`
  width: 100%;
  padding-bottom: 1rem;
  display: -ms-grid;
  display: -moz-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr;
  gap: 0.5rem 0.5rem;
  grid-template-areas: 'old-password old-password' 'new-password confirm-password';
`;

const OldPassword = styled(FormControl)`
  grid-area: old-password;
`;

const NewPassword = styled(FormControl)`
  grid-area: new-password;
`;

const ConfirmPassword = styled(FormControl)`
  grid-area: confirm-password;
`;

const impossiblePassword = Array(8)
  .fill(String.fromCharCode(1_112_064))
  .join('');

function ChangePassword() {
  const [visibility, setVisibility] = useState(0b000);
  const [oldPassword, setOldPassword] = useState(impossiblePassword);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <ChangePasswordGrid>
      <OldPassword size="small" variant="filled">
        <InputLabel>Password</InputLabel>

        <FilledInput
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          type={visibility & 0b001 ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setVisibility(visibility ^ 0b001)}
              >
                {visibility & 0b001 ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </OldPassword>

      <NewPassword size="small" variant="filled">
        <InputLabel>New password</InputLabel>

        <FilledInput
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          type={visibility & 0b010 ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setVisibility(visibility ^ 0b010)}
              >
                {visibility & 0b010 ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </NewPassword>

      <ConfirmPassword size="small" variant="filled">
        <InputLabel>Confirm Password</InputLabel>

        <FilledInput
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          type={visibility & 0b100 ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                size="small"
                onClick={() => setVisibility(visibility ^ 0b100)}
              >
                {visibility & 0b100 ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
      </ConfirmPassword>
    </ChangePasswordGrid>
  );
}

export default ChangePassword;

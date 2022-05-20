import Joi from 'joi';
import _debounce from 'lodash/debounce';
import { useState } from 'react';

import { bySeconds } from '@/common/helpers/timespan';
import { ResponseDTO } from '@/common/models/dto/response.dto';
import { AppRegistration } from '@mui/icons-material';
import {
  CircularProgress,
  FilledInput,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { DomainEntity } from '@/common/entities';

const ColoredFormHelperText = styled(FormHelperText)(({ theme }) => ({
  fontWeight: 500,
  '&.error': {
    color: theme.palette.error.main,
  },
  '&.success': {
    color: theme.palette.success.main,
  },
}));

const validator = Joi.string().domain().required();

enum MessageTypes {
  DEFAULT = 0,
  SUCCESS = 1,
  ERROR = 2,
}

const colors = {
  [MessageTypes.DEFAULT]: 'primary',
  [MessageTypes.SUCCESS]: 'success',
  [MessageTypes.ERROR]: 'error',
};

function DomainAdder() {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState({
    type: MessageTypes.DEFAULT,
    text: '',
  });

  const handleChange = _debounce(async () => {
    setChecking(true);

    const input = document.getElementById(
      'domain-register-input',
    ) as HTMLInputElement;

    const domain = input.value;

    if (domain.length === 0) {
      setMessage({
        type: MessageTypes.DEFAULT,
        text: '',
      });
      setChecking(false);
      return;
    }

    const validation = validator.validate(domain);

    if (validation.error) {
      setMessage({
        type: MessageTypes.ERROR,
        text: 'Domain is invalid',
      });
      setChecking(false);
      return;
    }

    const { statusCode }: ResponseDTO<unknown> = await fetch(
      `/api/domain/${domain}`,
    ).then((res) => res.json());

    switch (statusCode) {
      case HttpStatus.OK:
      case HttpStatus.FORBIDDEN:
        setMessage({
          type: MessageTypes.ERROR,
          text: 'Domain already registered',
        });
        break;

      default:
        setMessage({
          type: MessageTypes.SUCCESS,
          text: 'Domain is available',
        });
        break;
    }

    setChecking(false);
  }, bySeconds(0.5));

  const addDomain = async () => {
    const input = document.getElementById(
      'domain-register-input',
    ) as HTMLInputElement;

    const domain = input.value;

    if (domain.length === 0) return;

    const validation = validator.validate(domain);

    if (validation.error) return;

    const { statusCode, message, body }: ResponseDTO<DomainEntity> =
      await fetch(`/api/domain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          domain,
        }),
      }).then((res) => res.json());

    console.log(statusCode, message, body);
  };

  return (
    <FormControl fullWidth variant="filled">
      <InputLabel color={colors[message.type] as any}>
        Register new domain
      </InputLabel>
      <FilledInput
        color={colors[message.type] as any}
        inputProps={{ id: 'domain-register-input' }}
        onChange={handleChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              color={colors[message.type] as any}
              disabled={message.type !== MessageTypes.SUCCESS}
              onClick={addDomain}
            >
              {checking ? <CircularProgress size={24} /> : <AppRegistration />}
            </IconButton>
          </InputAdornment>
        }
      />
      <ColoredFormHelperText className={colors[message.type]}>
        {message.text}
      </ColoredFormHelperText>
    </FormControl>
  );
}

export default DomainAdder;

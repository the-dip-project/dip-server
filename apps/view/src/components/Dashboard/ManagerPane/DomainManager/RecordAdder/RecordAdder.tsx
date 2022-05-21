import * as Joi from 'joi';
import { useEffect, useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { CLASS, RCLASS, TYPE } from '@/common/constants/dns-spec';
import { EditableRecordTypes } from '@/common/constants/editable-record-type';
import { RecordEntity } from '@/common/entities';
import { ApplicationState } from '@/view/store';
import {
  Button,
  FilledInput,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { bySeconds } from '@/common/helpers/timespan';
import _debounce from 'lodash/debounce';
import { AdditionalValue } from './AdditionalValue';
import Flexbox from '@/view/common/components/Flexbox';
import styled from '@emotion/styled';
import { Add } from '@mui/icons-material';

const SubmitContainer = styled(Flexbox)`
  width: 100%;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const connector = connect(
  (state: ApplicationState) => ({
    domain: state.domain.domain,
  }),
  {},
);

const defaultRecord: RecordEntity = {
  id: undefined,
  host: '@',
  type: TYPE.A,
  class: CLASS.IN,
  data: '127.0.0.1',
  ttl: 3600,
  extendedData: '',
  domainId: 0,
  domain: null,
};

function joinDomain(sub: string, domain: string): string {
  return `${sub === '@' ? '' : sub + '.'}${domain}`;
}

const validator = Joi.string().domain().required();
const validationFn = _debounce(
  (
    originalValue: string,
    newValue: string,
    domain: string,
    callback: (result: string) => void,
  ) => {
    if (newValue.includes('.')) return callback(originalValue);

    const validation = validator.validate(joinDomain(newValue, domain));

    if (validation.error) return callback(originalValue);

    return callback(newValue);
  },
  bySeconds(0.5),
  { trailing: true },
);

function RecordAdder({ domain }: ConnectedProps<typeof connector>) {
  const [record, setRecord] = useState<RecordEntity>({ ...defaultRecord });
  const [originalHost, setOriginalHost] = useState('@');
  const Additional = AdditionalValue[record.type];

  const handleTTLChange = (event) => {
    const ttl = Number(event.target.value);

    if (Number.isNaN(ttl)) return;

    setRecord({ ...record, ttl });
  };

  const handleHostChange = (event) => {
    const host = event.target.value;

    validationFn(
      originalHost,
      host,
      domain.domain,
      (result) => (
        setRecord({
          ...record,
          host: result,
        }),
        setOriginalHost(result)
      ),
    );

    setRecord({ ...record, host: host });
  };

  useEffect(() => {
    if (domain && domain.id !== record.id)
      setRecord({ ...defaultRecord, domainId: domain.id });
  }, [domain]);

  return (
    <>
      <FormGroup row style={{ marginBottom: '1rem' }}>
        <FormControl
          variant="filled"
          style={{ minWidth: '6.5rem', width: '20%', marginRight: '1rem' }}
        >
          <InputLabel>Record type</InputLabel>

          <Select
            variant="filled"
            value={record.type}
            fullWidth
            onChange={(e) =>
              setRecord({ ...record, type: e.target.value as number })
            }
          >
            {EditableRecordTypes.map((type) => (
              <MenuItem key={`edit.record/${type[0]}`} value={type[0]}>
                {type[1]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl
          variant="filled"
          disabled
          style={{ minWidth: '4rem', width: '15%', marginRight: '1rem' }}
        >
          <InputLabel>Class</InputLabel>

          <FilledInput type="text" value={RCLASS[record.class as any]} />
        </FormControl>

        <FormControl variant="filled" style={{ flex: 1 }}>
          <InputLabel>Time to live (TTL)</InputLabel>

          <FilledInput
            type="number"
            value={record.ttl}
            onChange={handleTTLChange}
          />
        </FormControl>
      </FormGroup>

      <FormGroup row>
        <FormControl
          variant="filled"
          style={{ minWidth: '30%', width: '40%', marginRight: '1rem' }}
        >
          <InputLabel>Host</InputLabel>

          <FilledInput
            type="text"
            value={record.host}
            onChange={handleHostChange}
          />
        </FormControl>

        <FormControl variant="filled" style={{ flex: 1 }}>
          <InputLabel>Value</InputLabel>

          <FilledInput type="text" value={record.data} />
        </FormControl>
      </FormGroup>

      {Additional ? (
        <>
          <Typography
            variant="caption"
            component="div"
            fontWeight="bold"
            color="gray"
            margin="1rem 0.5rem"
          >
            Additional values
          </Typography>

          <Additional />
        </>
      ) : null}

      <SubmitContainer>
        <Button variant="contained">
          <Add />
          &nbsp;&nbsp;add new record
        </Button>
      </SubmitContainer>
    </>
  );
}

export default connector(RecordAdder);

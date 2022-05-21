import { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ApplicationState } from '@/view/store';
import { setEditingRecord } from '@/view/store/actions/domain/setEditingRecord';
import { FilledInput, FormControl, FormGroup, InputLabel } from '@mui/material';

import validate from './hostValidator';

const connector = connect(
  (state: ApplicationState) => ({
    host: state.domain.editingRecord.host,
    data: state.domain.editingRecord.data,
    domain: state.domain.domain,
  }),
  {
    setEditingRecord,
  },
);

function HostValueEditor({
  host,
  data,
  domain,
  setEditingRecord,
}: ConnectedProps<typeof connector>) {
  const [originalHost, setOriginalHost] = useState('@');

  const handleHostChange = (event) => {
    const { value } = event.target;

    validate(
      originalHost,
      value,
      domain.domain,
      (result) => (setEditingRecord({ host: result }), setOriginalHost(result)),
    );

    setEditingRecord({ host: value });
  };

  return (
    <FormGroup row>
      <FormControl
        variant="filled"
        style={{ minWidth: '30%', width: '40%', marginRight: '1rem' }}
      >
        <InputLabel>Host</InputLabel>

        <FilledInput type="text" value={host} onChange={handleHostChange} />
      </FormControl>

      <FormControl variant="filled" style={{ flex: 1 }}>
        <InputLabel>Value</InputLabel>

        <FilledInput type="text" value={data} />
      </FormControl>
    </FormGroup>
  );
}

export default connector(HostValueEditor);

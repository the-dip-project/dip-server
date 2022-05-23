import { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ApplicationState } from '@/view/store';
import { setEditingRecord } from '@/view/store/actions/domain/setEditingRecord';
import { FilledInput, FormControl, FormGroup, InputLabel } from '@mui/material';

import validate from './hostValidator';
import { TYPE } from '@/common/constants/dns-spec';

const connector = connect(
  (state: ApplicationState) => ({
    rrType: state.domain.editingRecord.type,
    host: state.domain.editingRecord.host,
    data: state.domain.editingRecord.data,
    domain: state.domain.domain,
  }),
  {
    setEditingRecord,
  },
);

const labels = {
  [TYPE.A]: 'Address',
  [TYPE.AAAA]: 'Address',
  [TYPE.MX]: 'Mail server',
  [TYPE.NS]: 'Name server',
  [TYPE.CNAME]: 'Domain',
  [TYPE.PTR]: 'Domain',
  [TYPE.TXT]: 'Value',
  [TYPE.SPF]: 'Value',
  [TYPE.SRV]: 'Target',
  [TYPE.SOA]: 'Primary',
  [TYPE.CAA]: 'Value',
};

function HostValueEditor({
  rrType,
  host,
  data,
  domain,
  setEditingRecord,
}: ConnectedProps<typeof connector>) {
  const [editingHost, setEditingHost] = useState('@');

  const handleHostChange = (event) => {
    const { value } = event.target;

    validate(
      host,
      value,
      domain.domain,
      (result) => (setEditingRecord({ host: result }), setEditingHost(result)),
    );

    setEditingHost(value);
  };

  return (
    <FormGroup row>
      <FormControl
        variant="filled"
        style={{ minWidth: '30%', width: '40%', marginRight: '1rem' }}
      >
        <InputLabel>Host</InputLabel>

        <FilledInput
          type="text"
          value={editingHost}
          onChange={handleHostChange}
        />
      </FormControl>

      <FormControl variant="filled" style={{ flex: 1 }}>
        <InputLabel>{labels[rrType] ?? 'Value'}</InputLabel>

        <FilledInput type="text" value={data} />
      </FormControl>
    </FormGroup>
  );
}

export default connector(HostValueEditor);

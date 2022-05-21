import { connect, ConnectedProps } from 'react-redux';

import { RCLASS } from '@/common/constants/dns-spec';
import { EditableRecordTypes } from '@/common/constants/editable-record-type';
import { ApplicationState } from '@/view/store';
import {
  FilledInput,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { setEditingRecord } from '@/view/store/actions/domain/setEditingRecord';

const connector = connect(
  (state: ApplicationState) => ({
    rrType: state.domain.editingRecord.type,
    rrClass: state.domain.editingRecord.class,
    rrTtl: state.domain.editingRecord.ttl,
  }),
  {
    setEditingRecord,
  },
);

function TypeClassTTLEditor({
  rrType,
  rrClass,
  rrTtl,
  setEditingRecord,
}: ConnectedProps<typeof connector>) {
  const handleTTLChange = (event) => {
    const ttl = Number(event.target.value);
    if (Number.isNaN(ttl)) return;
    setEditingRecord({ ttl });
  };

  return (
    <FormGroup row style={{ marginBottom: '1rem' }}>
      <FormControl
        variant="filled"
        style={{ minWidth: '6.5rem', width: '20%', marginRight: '1rem' }}
      >
        <InputLabel>Record type</InputLabel>

        <Select
          variant="filled"
          value={rrType}
          fullWidth
          onChange={(e) => setEditingRecord({ type: e.target.value as number })}
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

        <FilledInput type="text" value={RCLASS[rrClass as any]} />
      </FormControl>

      <FormControl variant="filled" style={{ flex: 1 }}>
        <InputLabel>Time to live (TTL)</InputLabel>

        <FilledInput type="number" value={rrTtl} onChange={handleTTLChange} />
      </FormControl>
    </FormGroup>
  );
}

export default connector(TypeClassTTLEditor);

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
import { connect, ConnectedProps } from 'react-redux';

const connector = connect(
  (state: ApplicationState) => ({
    record: state.domain.editingRecord,
  }),
  {},
);

function TypeClassTTLEditor({ record }: ConnectedProps<typeof connector>) {
  const handleTTLChange = (event) => {
    // const ttl = Number(event.target.value);
    // if (Number.isNaN(ttl)) return;
    // setRecord({ ...record, ttl });
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
          value={record.type}
          fullWidth
          // onChange={(e) =>
          //   setRecord({ ...record, type: e.target.value as number })
          // }
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
  );
}

export default connector(TypeClassTTLEditor);

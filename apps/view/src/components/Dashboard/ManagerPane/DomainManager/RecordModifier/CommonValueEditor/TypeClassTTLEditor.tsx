import { connect, ConnectedProps } from 'react-redux';

import { RCLASS } from '@/common/constants/dns-spec';
import { EditableRecordTypes } from '@/common/constants/editable-record-type';
import { ApplicationState } from '@/view/store';
import { setEditingRecord } from '@/view/store/actions/domain/setEditingRecord';
import {
  FilledInput,
  FormControl,
  FormGroup,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Theme,
} from '@mui/material';
import { styled } from '@mui/styles';

const TypeForm = styled(FormControl)(({ theme }: { theme: Theme }) => ({
  width: '20%',
  marginRight: '1rem',
  [theme.breakpoints.down('md')]: {
    width: '40%',
  },
}));

const ClassForm = styled(FormControl)(({ theme }: { theme: Theme }) => ({
  width: '15%',
  marginRight: '1rem',
  [theme.breakpoints.down('md')]: {
    marginRight: '0',
    width: 'calc(60% - 1rem + 0.02px)',
  },
}));

const TTLForm = styled(FormControl)(({ theme }: { theme: Theme }) => ({
  flex: 1,
  [theme.breakpoints.down('md')]: {
    marginTop: '1rem',
    flex: 'auto',
    width: '100%',
  },
}));

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
    setEditingRecord({ ttl: ~~ttl });
  };

  return (
    <FormGroup row style={{ marginBottom: '1rem' }}>
      <TypeForm variant="filled">
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
      </TypeForm>

      <ClassForm variant="filled" disabled>
        <InputLabel>Class</InputLabel>

        <FilledInput type="text" value={RCLASS[rrClass as any]} />
      </ClassForm>

      <TTLForm variant="filled">
        <InputLabel>Time to live (TTL)</InputLabel>

        <FilledInput type="number" value={rrTtl} onChange={handleTTLChange} />

        <FormHelperText>
          TTL must be an integer, after-dot will be omitted.
        </FormHelperText>
      </TTLForm>
    </FormGroup>
  );
}

export default connector(TypeClassTTLEditor);

import { ApplicationState } from '@/view/store';
import { FilledInput, FormControl, FormGroup, InputLabel } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';

const connector = connect(
  (state: ApplicationState) => ({
    record: state.domain.editingRecord,
  }),
  {},
);

function HostValueEditor({ record }: ConnectedProps<typeof connector>) {
  const handleHostChange = (event) => {
    // const host = event.target.value;
    // validate(
    //   originalHost,
    //   host,
    //   domain.domain,
    //   (result) => (
    //     setRecord({
    //       ...record,
    //       host: result,
    //     }),
    //     setOriginalHost(result)
    //   ),
    // );
    // setRecord({ ...record, host: host });
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
          value={record.host}
          onChange={handleHostChange}
        />
      </FormControl>

      <FormControl variant="filled" style={{ flex: 1 }}>
        <InputLabel>Value</InputLabel>

        <FilledInput type="text" value={record.data} />
      </FormControl>
    </FormGroup>
  );
}

export default connector(HostValueEditor);

import { FilledInput, FormControl, InputLabel } from '@mui/material';

function MXAdditional() {
  return (
    <>
      <FormControl variant="filled">
        <InputLabel>Priority</InputLabel>

        <FilledInput type="number" />
      </FormControl>
    </>
  );
}

export default MXAdditional;

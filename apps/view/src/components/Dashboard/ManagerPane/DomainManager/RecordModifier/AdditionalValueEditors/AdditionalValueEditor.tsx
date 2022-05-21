import { TYPE } from '@/common/constants/dns-spec';
import { ApplicationState } from '@/view/store';
import { Typography } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';

import MxAdditional from './MxAdditional';
import SrvAdditional from './SrvAdditional';

export const AdditionalValueEditors = {
  [TYPE.MX]: MxAdditional,
  [TYPE.SRV]: SrvAdditional,
};

const connector = connect(
  (state: ApplicationState) => ({
    record: state.domain.editingRecord,
  }),
  {},
);

function AdditionalValueEditor({ record }: ConnectedProps<typeof connector>) {
  const { type } = record;
  const Additional = AdditionalValueEditors[type];

  if (!Additional) return null;

  return (
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
  );
}

export default connector(AdditionalValueEditor);

import Flexbox from '@/view/common/components/Flexbox';
import { ApplicationState } from '@/view/store';
import styled from '@emotion/styled';
import { Add, Edit } from '@mui/icons-material';
import { Button } from '@mui/material';
import { connect, ConnectedProps } from 'react-redux';

const SubmitContainer = styled(Flexbox)`
  width: 100%;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const connector = connect(
  (state: ApplicationState) => ({
    purpose: state.domain.recordModifierPurpose,
  }),
  {},
);

function ModifierHandler({ purpose }: ConnectedProps<typeof connector>) {
  return (
    <SubmitContainer>
      <Button variant="contained">
        {purpose === 'create' ? (
          <>
            <Add />
            &nbsp;&nbsp;add new record
          </>
        ) : (
          <>
            <Edit />
            &nbsp;&nbsp;edit record
          </>
        )}
      </Button>
    </SubmitContainer>
  );
}

export default connector(ModifierHandler);

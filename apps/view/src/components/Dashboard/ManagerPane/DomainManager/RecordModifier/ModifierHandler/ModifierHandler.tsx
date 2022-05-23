import Flexbox from '@/view/common/components/Flexbox';
import { ApplicationState } from '@/view/store';
import { setModifierPurpose } from '@/view/store/actions/domain/setModifierPurpose';
import styled from '@emotion/styled';
import { Add, Edit } from '@mui/icons-material';
import { Button, ButtonGroup } from '@mui/material';
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
  {
    setModifierPurpose,
  },
);

function ModifierHandler({
  purpose,
  setModifierPurpose,
}: ConnectedProps<typeof connector>) {
  return (
    <SubmitContainer>
      {purpose === 'create' ? (
        <>
          <Button variant="contained" size="small">
            <Add />
            &nbsp;&nbsp;add new record
          </Button>
        </>
      ) : (
        <ButtonGroup variant="contained" size="small">
          <Button onClick={() => setModifierPurpose('create')}>
            <Add />
          </Button>

          <Button>
            <Edit />
            &nbsp;&nbsp;edit record
          </Button>
        </ButtonGroup>
      )}
    </SubmitContainer>
  );
}

export default connector(ModifierHandler);

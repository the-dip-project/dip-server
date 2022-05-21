import _debounce from 'lodash/debounce';
import { useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ApplicationState } from '@/view/store';
import { resetEditingRecord } from '@/view/store/actions/domain/resetEditingRecord';

import AdditionalValueEditor from './AdditionalValueEditors/AdditionalValueEditor';
import CommonValueEditor from './CommonValueEditor/CommonValueEditor';
import ModifierHandler from './ModifierHandler/ModifierHandler';

const connector = connect(
  (state: ApplicationState) => ({
    domainId: state.domain.domain?.id,
    recordId: state.domain.editingRecord.id,
  }),
  {
    resetEditingRecord,
  },
);

function RecordModifier({
  domainId,
  recordId,
  resetEditingRecord,
}: ConnectedProps<typeof connector>) {
  useEffect(() => {
    if (domainId !== recordId) resetEditingRecord({ domainId: domainId });
  }, [domainId]);

  return (
    <>
      <CommonValueEditor />

      <AdditionalValueEditor />

      <ModifierHandler />
    </>
  );
}

export default connector(RecordModifier);

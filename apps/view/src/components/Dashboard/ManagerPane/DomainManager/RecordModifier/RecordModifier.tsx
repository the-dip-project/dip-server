import _debounce from 'lodash/debounce';
import { useState } from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { ApplicationState } from '@/view/store';

import AdditionalValueEditor from './AdditionalValueEditors/AdditionalValueEditor';
import CommonValueEditor from './CommonValueEditor/CommonValueEditor';
import ModifierHandler from './ModifierHandler/ModifierHandler';

const connector = connect(
  (state: ApplicationState) => ({
    domain: state.domain.domain,
    record: state.domain.editingRecord,
  }),
  {},
);

function RecordModifier({ domain, record }: ConnectedProps<typeof connector>) {
  const [originalHost, setOriginalHost] = useState('@');

  return (
    <>
      <CommonValueEditor />

      <AdditionalValueEditor />

      <ModifierHandler />
    </>
  );
}

export default connector(RecordModifier);

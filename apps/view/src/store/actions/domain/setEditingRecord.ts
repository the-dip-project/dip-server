import _omit from 'lodash/omit';

import { RecordEntity } from '@/common/entities';

import { Action, ActionTypes, AppThunkAction } from '../..';
import { defaultRecord } from '../../reducers/domain';

type PartialRecord = Partial<Omit<RecordEntity, 'id' | 'domain'>>;

const includedFields = new Set<keyof PartialRecord>(
  Object.keys(_omit(defaultRecord, 'id', 'domain')) as any,
);

export function setEditingRecord(
  record: PartialRecord,
): AppThunkAction<Action<PartialRecord>, void> {
  for (const key in record)
    if (!includedFields.has(key as keyof PartialRecord)) delete record[key];

  return (dispatch) => {
    dispatch({
      type: ActionTypes.DOMAIN__SET_EDITING_RECORD,
      payload: { ...record },
    });
  };
}

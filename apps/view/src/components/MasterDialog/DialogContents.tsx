import ConfirmDialog from './ConfirmDialog/ConfirmDialog';
import SuConfirmDialog from './SuConfirmDialog/SuConfirmDialog';

export enum DialogContentIndex {
  NONE = 0,
  CONFIRM_DIALOG = 1,
  SU_CONFIRM_DIALOG = 2,
}

export const DialogContents = {
  [DialogContentIndex.NONE]: <></>,
  [DialogContentIndex.CONFIRM_DIALOG]: <ConfirmDialog />,
  [DialogContentIndex.SU_CONFIRM_DIALOG]: <SuConfirmDialog />,
};

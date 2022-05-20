import ConfirmDialog from './ConfirmDialog/ConfirmDialog';

export enum DialogContentIndex {
  NONE = 0,
  CONFIRM_DIALOG = 1,
}

export const DialogContents = {
  [DialogContentIndex.NONE]: <></>,
  [DialogContentIndex.CONFIRM_DIALOG]: <ConfirmDialog />,
};

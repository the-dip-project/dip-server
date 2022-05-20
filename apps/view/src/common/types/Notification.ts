export enum NotificationSeverity {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

export type Notification = {
  open: boolean;
  message: string;
  severity: NotificationSeverity;
};

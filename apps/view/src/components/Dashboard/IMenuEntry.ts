export interface IMenuEntry {
  order: number;
  icon?: JSX.Element;
  label: string;
  path: string;
  minPrivilege: number;
}

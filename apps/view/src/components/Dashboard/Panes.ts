import { IMenuEntry } from './IMenuEntry';

export class PaneRegister {
  private static readonly instance: PaneRegister = new PaneRegister();
  private readonly metaList: IMenuEntry[];

  private constructor() {
    this.metaList = [];
  }

  public register(meta: IMenuEntry): void {
    this.metaList.push(meta);
  }

  public getAll(): IMenuEntry[] {
    return this.metaList;
  }

  public static getInstance(): PaneRegister {
    return PaneRegister.instance;
  }
}

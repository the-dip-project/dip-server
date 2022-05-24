declare namespace Express {
  export interface Request {
    user?: any;
    escalatedUntil?: number;
  }
}

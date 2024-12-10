declare namespace Express {
  interface Request {
    session?: {
      id: number;
      key: string;
      userId: number;
      expires: number;
    }
    version: string;
  }
}

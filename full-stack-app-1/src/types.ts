declare namespace Express {
  interface Request {
    session?: {
      id: number;
      key: string;
      userId: number;
      expires: string;
    }
    version: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        auth0UserId: string;
      };
    }
  }
}

export {};

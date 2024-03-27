import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";

const SECRET_KEY: string | undefined = process.env.SECRET_KEY;

interface DecodedUser {
  userId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: DecodedUser;
    }
  }
}

function auth(req: Request, res: Response, next: NextFunction) {
  const authorization: string | undefined = req.headers.authorization;

  if (!authorization) {
    return res.status(401).json({
      message: "No Authorization Header"
    });
  }

  try {
    const token: string | undefined = authorization.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid Token Format"
      });
    }

    if (!SECRET_KEY) {
      throw new Error("Secret key not provided");
    }

    const decoded: DecodedUser = jwt.verify(token, SECRET_KEY) as DecodedUser;
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error instanceof TokenExpiredError) {
      return res.status(401).json({
        message: "Session Expired",
        error: error.message
      });
    }

    if (error instanceof JsonWebTokenError) {
      return res.status(401).json({
        message: "Invalid Token",
        error: error.message
      });
    }

    res.status(500).json({
      message: "Internal server Error",
      error: error.message
    });
  }
}

export default auth;

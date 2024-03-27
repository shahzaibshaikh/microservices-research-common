import { Request, Response, NextFunction } from "express";
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
declare function auth(req: Request, res: Response, next: NextFunction): Response<any, Record<string, any>> | undefined;
export default auth;

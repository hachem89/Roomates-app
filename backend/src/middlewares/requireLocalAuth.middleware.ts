import { NextFunction, Request, Response } from "express";
import passport from "passport";
import { HTTPSTATUS } from "../constants/httpStatus.constant";

const requireLocalAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "local",
    (
      err: Error | null,
      user: Express.User | false,
      info: { message?: string } | undefined
    ) => {
      if (err) {
          return next(err);
        }

       if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }
        
      req.user = user; // Attach user manually
      next(); // Proceed to the controller
    }
  )(req, res, next);
};

export default requireLocalAuth;

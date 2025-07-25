import { Request, Response, NextFunction } from "express";
import passport from "passport";
import { HTTPSTATUS } from "../constants/httpStatus.constant";

const requireJwtAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (
      err: Error | null,
      user: Express.User | false,
      info: { message?: string } | undefined
    ) => {
      if (err) {
        console.error("JWT error:", err);
        return res.status(HTTPSTATUS.INTERNAL_SERVER_ERROR).json({
          message: "Something went wrong with authentication",
        });
      }

      if (!user) {
        let message = "Unauthorized";

        // Customize message based on `info` from Passport
        if (info?.message === "No auth token") {
          message = "No token provided in header";
        } else if (info?.message === "jwt malformed") {
          message = "Invalid token format";
        } else if (info?.message === "invalid signature") {
          message = "Token has invalid signature hahahahaha";
        } else if (info?.message === "jwt expired") {
          message = "Token has expired, please log in again.";
        }

        return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message });
      }

      // Attach user to req and move to next middleware
      req.user = user;
      next();
    }
  )(req, res, next);
};

export default requireJwtAuth;

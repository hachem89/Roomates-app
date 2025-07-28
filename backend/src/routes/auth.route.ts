import { Request, Response, Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import {
  googleLoginCallback,
  loginController,
  logoutFromAllDevicesController,
  logoutFromCurrentDeviceController,
  refreshTokenController,
  registerUserController,
} from "../controllers/auth.controller";
import requireJwtAuth from "../middlewares/requireJwtAuth.middleware";
import requireLocalAuth from "../middlewares/requireLocalAuth.middleware";

const failedUrl = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`;

const authRoutes = Router();

authRoutes.post("/register", registerUserController);
authRoutes.post("/login", requireLocalAuth, loginController);

// logout from specific device:
authRoutes.post(
  "/logoutDevice",
  requireJwtAuth,
  logoutFromCurrentDeviceController
);
// logout from all devices:
authRoutes.post("/logoutAll", requireJwtAuth, logoutFromAllDevicesController);

// enpoint to generate new access token after it expires
authRoutes.post("/refreshToken", refreshTokenController);

// test route will be removed later
authRoutes.get(
  "/currentUser",
  requireJwtAuth,
  async (req: Request, res: Response) => {
    const currentUser = req.user;
    res.json({ currentUser });
  }
);

// routes for google
authRoutes.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

authRoutes.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: failedUrl,
    session: false,
  }),
  googleLoginCallback
);

export default authRoutes;

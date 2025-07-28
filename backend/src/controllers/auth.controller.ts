import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { registreSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../constants/httpStatus.constant";
import {
  refreshTokenService,
  registerUserService,
  setTokens,
} from "../services/auth.service";
import { UnauthorizedException } from "../utils/appError";

// this is for googleStrategy
export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentHouse = req.user?.currentHouse;
    if (!currentHouse) {
      res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
    }

    const { accessToken, refreshToken } = await setTokens(req.user?._id);
    console.log("access token: ", accessToken);
    console.log("refresh token: ", refreshToken);

    res.redirect(
      `${config.FRONTEND_ORIGIN}/house/${currentHouse}?accesToken=${accessToken}&refreshToken=${refreshToken}`
    );
  }
);

// this is for creating an account with email
export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registreSchema.parse({
      ...req.body,
    });

    const { userId } = await registerUserService(body);
    const { accessToken, refreshToken } = await setTokens(userId);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User Created Successfully",
      accessToken,
      refreshToken,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { accessToken, refreshToken } = await setTokens(req.user?._id);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "User Logged in Successfully",
      accessToken,
      refreshToken,
    });
  }
);

// refresh token:
export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh Token Not Provided");
    }

    const { newAccessToken } = await refreshTokenService(refreshToken);

    return res.status(HTTPSTATUS.OK).json({
      message: "Token refreshed successfully",
      newAccessToken,
    });
  }
);

import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import { generateJWT } from "../utils/jwt";
import { registreSchema } from "../validation/auth.validation";
import { HTTPSTATUS } from "../constants/httpStatus.constant";
import { registerUserService } from "../services/auth.service";

// this is for googleStrategy
export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentHouse = req.user?.currentHouse;
    if (!currentHouse) {
      res.redirect(`${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`);
    }

    const token = generateJWT(req.user?._id);
    console.log("token: ", token);

    res.redirect(
      `${config.FRONTEND_ORIGIN}/house/${currentHouse}?token=${token}`
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
    const token = generateJWT(userId);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "User Created Successfully",
      token,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const token = generateJWT(req.user?._id);
    return res.status(HTTPSTATUS.CREATED).json({
      message: "User Logged in Successfully",
      token,
    });
  }
);

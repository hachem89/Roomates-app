import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { HTTPSTATUS } from "./constants/httpStatus.constant";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import requireJwtAuth from "./middlewares/requireJwtAuth.middleware";
import houseRoutes from "./routes/house.route";
import memberRoutes from "./routes/member.route";

const app = express();

const BASE_PATH = config.BASE_PATH;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTPSTATUS.OK).json({
      message: "Hellloooooooooooooooooo",
    });
  })
);

// google login
// login
// registre
// logout
// refresh token
app.use(`${BASE_PATH}/auth`, authRoutes);

// current user
app.use(`${BASE_PATH}/user`, requireJwtAuth,userRoutes);

// create new house
// update house
// get house by id
// get all the houses of a member
// get the house members
// get house analytics
// change house member role
// delete house
app.use(`${BASE_PATH}/house`, requireJwtAuth,houseRoutes);

// join house by invite code
app.use(`${BASE_PATH}/member`, requireJwtAuth,memberRoutes);

app.use(errorHandler);

app.listen(config.PORT, async () => {
  console.log(`Server running on port ${config.PORT} in ${config.NODE_ENV}`);
  await connectDatabase();
});

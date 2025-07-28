import { Router } from "express";
import requireJwtAuth from "../middlewares/requireJwtAuth.middleware";
import { getCurrentUserController } from "../controllers/user.controller";

const userRoutes = Router()

userRoutes.get("/currentUser", getCurrentUserController)

export default userRoutes
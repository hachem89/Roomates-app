import { Router } from "express";
import { joinHouseByInviteController } from "../controllers/member.controller";

const memberRoutes = Router()

memberRoutes.post("/house/:inviteCode/join", joinHouseByInviteController)

export default memberRoutes
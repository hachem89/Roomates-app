import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import z from "zod";
import { HTTPSTATUS } from "../constants/httpStatus.constant";
import { joinHouseByInviteService } from "../services/member.service";

export const joinHouseByInviteController = asyncHandler(
    async(req:Request, res:Response)=>{
        const inviteCode = z.string().parse(req.params.inviteCode)

        const userId = req.user?._id

        const {houseId, role} = await joinHouseByInviteService(userId, inviteCode)

        return res.status(HTTPSTATUS.OK).json({
            message: "Successfully joined the house",
            houseId,
            role
        })
    }
)
import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const createHouseController = asyncHandler(
    async(req:Request, res:Response)=>{
            
    }
)

export const getHouseByIdController = asyncHandler(
    async(req:Request, res:Response)=>{
        
    }
)

export const getAllHousesUserIsMemberController = asyncHandler(
    async(req:Request, res:Response)=>{
        
    }
)

export const getHouseMembersController = asyncHandler(
    async(req:Request, res:Response)=>{
        
    }
)

export const getHouseAnalyticsController = asyncHandler(
    async(req:Request, res:Response)=>{
        
    }
)

export const updateHouseByIdController = asyncHandler(
    async(req:Request, res:Response)=>{
        
    }
) 

export const changeHouseMemberRoleController = asyncHandler(
    async(req:Request, res:Response)=>{
        
    }
) 

export const deleteHouseByIdController = asyncHandler(
    async(req:Request, res:Response)=>{
        
    }
)
import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { createHouseSchema } from "../validation/house.validation";
import { HTTPSTATUS } from "../constants/httpStatus.constant";
import { createHouseService } from "../services/house.service";

export const createHouseController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createHouseSchema.parse(req.body);

    const userId = req.user?._id;

    const { house } = await createHouseService(userId, body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: "House Created Successfully",
      house,
    });
  }
);

export const getHouseByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const getAllHousesUserIsMemberController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const getHouseMembersController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const getHouseAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const updateHouseByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const changeHouseMemberRoleController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const deleteHouseByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  createHouseSchema,
  houseIdSchema,
} from "../validation/house.validation";
import { HTTPSTATUS } from "../constants/httpStatus.constant";
import { createHouseService, getAllHousesUserIsMemberService, getHouseByIdService } from "../services/house.service";
import { getMemberRoleInHouse } from "../services/member.service";

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
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);
    const userId = req.user?._id

    // cheks if the user is a member of the house or not
    await getMemberRoleInHouse(userId,houseId)

    const { house } = await getHouseByIdService(houseId);

    return res.status(HTTPSTATUS.OK).json({
      message: "House fetched successfully",
      house,
    });
  }
);

export const getAllHousesUserIsMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id

    const {houses} = await getAllHousesUserIsMemberService(userId)

    return res.status(HTTPSTATUS.OK).json({
      message: "All Houses fetched successfully",
      houses
    })
  }
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

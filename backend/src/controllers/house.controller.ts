import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import {
  changeRoleSchema,
  createHouseSchema,
  houseIdSchema,
  updateHouseSchema,
} from "../validation/house.validation";
import { HTTPSTATUS } from "../constants/httpStatus.constant";
import {
  changeHouseMemberRoleService,
  createHouseService,
  getAllHousesUserIsMemberService,
  getHouseByIdService,
  getHouseMembersService,
  updateHouseByIdService,
} from "../services/house.service";
import { getMemberRoleInHouse } from "../services/member.service";
import { Permissions } from "../constants/role.constant";
import { roleGuard } from "../utils/roleGuard";

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
    const userId = req.user?._id;

    // cheks if the user is a member of the house or not
    await getMemberRoleInHouse(userId, houseId);

    const { house } = await getHouseByIdService(houseId);

    return res.status(HTTPSTATUS.OK).json({
      message: "House fetched successfully",
      house,
    });
  }
);

export const getAllHousesUserIsMemberController = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;

    const { houses } = await getAllHousesUserIsMemberService(userId);

    return res.status(HTTPSTATUS.OK).json({
      message: "All Houses fetched successfully",
      houses,
    });
  }
);

export const getHouseMembersController = asyncHandler(
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { members, roles } = await getHouseMembersService(houseId);

    return res.status(HTTPSTATUS.OK).json({
      message: "House members fetched successfully",
      members,
      roles,
    });
  }
);

export const getHouseAnalyticsController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const updateHouseByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, description } = updateHouseSchema.parse(req.body);
    const houseId = houseIdSchema.parse(req.params.houseId);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.EDIT_HOUSE]);

    const { house } = await updateHouseByIdService(houseId, name, description);

    return res.status(HTTPSTATUS.OK).json({
      message: "House updated successfully",
      house,
    });
  }
);

export const changeHouseMemberRoleController = asyncHandler(
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);
    const { memberId, roleId } = changeRoleSchema.parse(req.body);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.CHANGE_MEMBER_ROLE]);

    const { member } = await changeHouseMemberRoleService(
      houseId,
      memberId,
      roleId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Member role changed successfully",
      member,
    });
  }
);

export const deleteHouseByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

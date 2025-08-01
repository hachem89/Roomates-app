import { ErrorCodeEnum } from "../constants/error-code.constant";
import HouseModel from "../models/house.model";
import MemberModel from "../models/member.model";
import { NotFoundException, UnauthorizedException } from "../utils/appError";

export const getMemberRoleInHouse = async (userId: string, houseId: string) => {
  const house = await HouseModel.findById(houseId);
  if (!house) {
    throw new NotFoundException("House Not Found");
  }

  const member = await MemberModel.findOne({ userId, houseId }).populate(
    "role"
  );

  if (!member) {
    throw new UnauthorizedException(
      "You are not a member of this house",
      ErrorCodeEnum.ACCESS_UNAUTHORIZED
    );
  }

  const roleName = member.role?.name;

  return {
    role: roleName,
  };
};

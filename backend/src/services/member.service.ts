import mongoose from "mongoose";
import { ErrorCodeEnum } from "../constants/error-code.constant";
import HouseModel from "../models/house.model";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import { Roles } from "../constants/role.constant";

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

export const joinHouseByInviteService = async (
  userId: string,
  inviteCode: string
) => {
  // find house by invite code
  const house = await HouseModel.findOne({ inviteCode });
  if (!house) {
    throw new NotFoundException("Invalid invite code or house not found");
  }

  // check if the user is already a member in the house
  const existingMember = await MemberModel.findOne({
    userId,
    houseId: house._id,
  }).exec();
  if (existingMember) {
    throw new BadRequestException("You are already a member of this house");
  }

  const memberRole = await RoleModel.findOne({
    name: Roles.MEMBER,
  });
  if (!memberRole) {
    throw new NotFoundException("Member role not found");
  }

  // Add user to the house as a member
  const newMember = new MemberModel({
    userId,
    houseId: house._id,
    role: memberRole,
    joinedAt: new Date(),
  });
  await newMember.save();

  house.membersCount = house.membersCount + 1;
  await house.save();

  return {
    houseId: house._id,
    role: memberRole.name,
  };
};

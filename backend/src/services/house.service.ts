import mongoose from "mongoose";
import { Roles } from "../constants/role.constant";
import HouseModel from "../models/house.model";
import MemberModel from "../models/member.model";
import RoleModel from "../models/roles-permission.model";
import UserModel from "../models/user.model";
import { NotFoundException } from "../utils/appError";

export const createHouseService = async (
  userId: string,
  body: {
    name: string;
    description?: string | undefined;
  }
) => {
  const { name, description } = body;

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new NotFoundException("User Not Found");
  }

  const ownerRole = await RoleModel.findOne({ name: Roles.OWNER });
  if (!ownerRole) {
    throw new NotFoundException("Owner Role Not Found");
  }

  const house = new HouseModel({
    name,
    description,
    owner: user._id,
  });

  await house.save();

  const member = new MemberModel({
    userId: user._id,
    houseId: house._id,
    role: ownerRole._id,
    joinedAt: new Date(),
  });

  await member.save();

  user.currentHouse = house._id as mongoose.Types.ObjectId;
  await user.save();

  return {
    house,
  };
};

export const getHouseByIdService = async (houseId: string) => {
  const house = await HouseModel.findById(houseId);
  if (!house) {
    throw new NotFoundException("House not found");
  }

  // populate the house with the members:
  const members = await MemberModel.find({
    houseId,
  }).populate("role");

  const houseWithMembers = {
    ...house.toObject(),
    members,
  };

  return {
    house: houseWithMembers,
  };
};

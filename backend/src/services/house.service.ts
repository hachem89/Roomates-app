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

export const getAllHousesUserIsMemberService = async (userId: string) => {
  const memberships = await MemberModel.find({ userId })
    .populate("houseId")
    .exec(); // optional, but good practice. It turns the query into a real Promise and avoids surprises.

  const houses = memberships.map((membership) => membership.houseId);

  return { houses };
};

export const getHouseMembersService = async (houseId: string) => {
  const members = await MemberModel.find({ houseId })
    .populate("userId", "name email profilePicture -password")
    .populate("role", "name");

  // we need roles also in the response because we want to  Display role labels or building dropdowns to change a member role
  const roles = await RoleModel.find({}, { name: 1, _id: 1 }) //Equivalent to: .select("name _id").
    .lean(); //It tells Mongoose to return plain JavaScript objects instead of full Mongoose documents.

  return {
    members,
    roles,
  };
};

export const updateHouseByIdService = async (
  houseId: string,
  name: string,
  description?: string
) => {
  const house = await HouseModel.findById(houseId);

  if (!house) {
    throw new NotFoundException("House not found");
  }

  house.name = name || house.name;
  house.description = description || house.description;
  await house.save();

  return {
    house,
  };
};

export const changeHouseMemberRoleService = async (
  houseId: string,
  memberId: string,
  roleId: string
) => {
  const member = await MemberModel.findOne({
    userId: memberId,
    houseId,
  });

  if(!member){
    throw new Error("Member not found in the house")
  }

  const role = await RoleModel.findById(roleId)
  if(!role){
    throw new NotFoundException("Role not found")
  }

  member.role = role
  await member.save()

  return{
    member
  }
};

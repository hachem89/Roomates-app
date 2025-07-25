import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import HouseModel from "../models/house.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../constants/role.constant";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../constants/account-provider.constant";

// this service is for googleStrategy
export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  console.log("auth.service");
  const { provider, providerId, displayName, picture, email } = data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log("Started session...");

    let user = await UserModel.findOne({ email }).session(session);
    if (!user) {
      // create a new user if it doesn't exist
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerAccountId: providerId,
      });
      await account.save({ session });

      //   create a new house for the new user
      const house = new HouseModel({
        name: "My House",
        description: `House created for ${user.name}`,
        owner: user._id,
      });
      await house.save({ session });

      const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(
        session
      );
      if (!ownerRole) {
        throw new NotFoundException("Owner Role Not Found");
      }

      const member = new MemberModel({
        userId: user._id,
        houseId: house._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      //   set the currentHouse of the user to the new house:
      user.currentHouse = house._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    console.log("End Session...");
    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

// this service is for email strategy (local)
export const registerUserService = async (body: {
  name: string;
  email: string;
  password: string;
}) => {
  const { name, email, password } = body;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) throw new BadRequestException("Email already exists");

    const user = new UserModel({
      name,
      email,
      password,
    });
    await user.save({ session });

    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerAccountId: email,
    });
    await account.save({ session });

    //   create a new house for the new user
    const house = new HouseModel({
      name: "My House",
      description: `House created for ${user.name}`,
      owner: user._id,
    });
    await house.save({ session });

    const ownerRole = await RoleModel.findOne({ name: Roles.OWNER }).session(
      session
    );
    if (!ownerRole) {
      throw new NotFoundException("Owner Role Not Found");
    }

    const member = new MemberModel({
      userId: user._id,
      houseId: house._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    //   set the currentHouse of the user to the new house:
    user.currentHouse = house._id as mongoose.Types.ObjectId;
    await user.save({ session });

    await session.commitTransaction();
    session.endSession();
    console.log("End Session...");

    return {
      userId: String(user._id),
      houseId: String(house._id),
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  const account = await AccountModel.findOne({
    provider,
    providerAccountId: email,
  });
  if (!account) throw new NotFoundException("Invalid Email or Password");

  const user = await UserModel.findById(account.userId);
  if (!user)
    throw new NotFoundException("User not found for this given account");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new UnauthorizedException("Invalid Email or Password");

  return user.omitPassword();
};

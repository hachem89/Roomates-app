import mongoose from "mongoose";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import HouseModel from "../models/house.model";
import RoleModel from "../models/roles-permission.model";
import { Roles } from "../constants/role.constant";
import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../constants/account-provider.constant";
import { generateJWT, generateRefreshToken } from "../utils/jwt";
import RefreshTokenModel from "../models/refreshToken.model";
import jwt from "jsonwebtoken";
import { config } from "../config/app.config";

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

// function that creates the tokens after login/registre:
export const setTokens = async (userId: string) => {
  const accessToken = generateJWT(userId);
  const _refreshToken = generateRefreshToken(userId);

  // save refresh token to db:
  const refreshToken = new RefreshTokenModel({
    userId,
    token: _refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days in ms
  });
  await refreshToken.save();

  return {
    accessToken,
    refreshToken: _refreshToken,
  };
};

// refreshToken service:
export const refreshTokenService = async (refreshToken: string) => {
  // find the refresh token in the db:
  const storedRefreshToken = await RefreshTokenModel.findOne({
    token: refreshToken,
  });
  if (!storedRefreshToken) {
    throw new ForbiddenException("Refresh token invalid or not found");
  }

  // check if expired:
  if (storedRefreshToken.expiresAt < new Date()) {
    await storedRefreshToken.deleteOne();
    throw new ForbiddenException("Refresh Token expired");
  }

  // optionally, verify the token itself:
  let payload;
  try {
    payload = jwt.verify(refreshToken, config.JWT_REFRESH_SECRET);
  } catch (error) {
    throw new ForbiddenException("Invalid refresh token");
  }

  const userId = storedRefreshToken.userId.toString();

  const newAccessToken = generateJWT(userId);

  return {
    newAccessToken,
  };
};

// logout services:
export const logoutFromCurrentDeviceService = async ({
  userId,
  refreshToken,
}: {
  userId: string;
  refreshToken: string;
}) => {
  const deleted = await RefreshTokenModel.findOneAndDelete({
    userId,
    token: refreshToken,
  });

  if (!deleted) {
    throw new NotFoundException("Refresh Token Not Found");
  }

  return {
    deleted
  }
};

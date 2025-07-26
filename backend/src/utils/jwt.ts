import "dotenv/config";
import jwt from "jsonwebtoken";

import { config } from "../config/app.config";

export const generateJWT = (_id: string): string => {
  const token = jwt.sign(
    {
      id: _id,
      type: "access",
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRATION_TIME as jwt.SignOptions["expiresIn"] }
  );
  return token;
};

export const generateRefreshToken = (_id: string): string => {
  const refreshToken = jwt.sign(
    {
      id: _id,
      type: "refresh",
    },
    config.JWT_REFRESH_SECRET,
    {
      expiresIn:
        config.JWT_REFRESH_SECRET_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    }
  );
  return refreshToken;
};

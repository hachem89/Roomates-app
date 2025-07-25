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

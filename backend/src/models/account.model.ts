import mongoose, { Document, mongo, Schema } from "mongoose";
import {
  ProviderEnum,
  ProviderEnumType,
} from "../constants/account-provider.constant";

export interface AccountDocument extends Document {
  userId: mongoose.Types.ObjectId;
  provider: ProviderEnumType;
  providerAccountId: string; //store the email, googleId, facebookId as the providerAccountId
  createdAt: string;
}

const accountSchema = new Schema<AccountDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(ProviderEnum),
      required: true,
    },
    providerAccountId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const AccountModel = mongoose.model<AccountDocument>("Account", accountSchema);
export default AccountModel;

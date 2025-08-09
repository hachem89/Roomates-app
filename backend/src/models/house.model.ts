import mongoose, { Document, Schema } from "mongoose";
import { generateInviteCode } from "../utils/uuid";

export interface HouseDocument extends Document {
  name: string;
  description: string | null;
  owner: mongoose.Types.ObjectId;
  inviteCode: string;
  membersCount: number,
  createdAt: Date;
  updatedAt: Date;
}

const houseSchema = new Schema<HouseDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    inviteCode: {
      type: String,
      required: true,
      unique: true,
      default: generateInviteCode,
    },
    membersCount:{
        type: Number,
        default: 1
    }
  },
  {
    timestamps: true,
  }
);

houseSchema.methods.resetInviteCode = function () {
  this.inviteCode = generateInviteCode();
};

const HouseModel = mongoose.model<HouseDocument>("House", houseSchema);
export default HouseModel;

import mongoose, { Document, mongo, Schema } from "mongoose";
import { RoleDocument } from "./roles-permission.model";

export interface MemberDocument extends Document {
  userId: mongoose.Types.ObjectId;
  houseId: mongoose.Types.ObjectId;
  role: RoleDocument;
  joinedAt: Date;
}

const memberSchema = new Schema<MemberDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    houseId: {
      type: Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      require: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },  
  {
    timestamps: true,
  }
);

const MemberModel = mongoose.model<MemberDocument>("Member", memberSchema);
export default MemberModel;

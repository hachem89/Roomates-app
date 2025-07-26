import mongoose, { Schema, Document } from "mongoose";

export interface RefreshTokenDocument extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const refreshTokenSchema = new Schema<RefreshTokenDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RefreshTokenModel = mongoose.model<RefreshTokenDocument>(
  "RefreshToken",
  refreshTokenSchema
);
export default RefreshTokenModel;

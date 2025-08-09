import mongoose, { Schema, Document } from "mongoose";

export interface ParticipantDocument extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
}

export const participantSchema = new Schema<ParticipantDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    _id: false,
  }
);

import mongoose, { Schema, Document } from "mongoose";

export interface GroceryListDocument extends Document {
  title: string;
  emoji: string;
  houseId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const groceryListSchema = new Schema<GroceryListDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    emoji: {
      type: String,
      required: false,
      trim: true,
      default: "🛒",
    },
    houseId: {
      type: Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const GroceryListModel = mongoose.model<GroceryListDocument>(
  "GroceryList",
  groceryListSchema
);
export default GroceryListModel;

import mongoose, { Schema, Document } from "mongoose";
import { Units, UnitsType } from "../constants/unit.constant";

export interface GroceryItemDocument extends Document {
  name: string;
  quantity: number;
  packageSize: number;
  unit: UnitsType;
  pricePerUnit: number;
  groceryListId: mongoose.Types.ObjectId;
  houseId: mongoose.Types.ObjectId;
  purchasedBy?: mongoose.Types.ObjectId | null;
  isPurchased: boolean;
  purchasedDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const groceryItemSchema = new Schema<GroceryItemDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1
    },
    packageSize:{
      type: Number,
      required: true,
      default: 0
    }
    ,
    unit: {
      type: String,
      enum: Object.values(Units),
      required: true,
      default: Units.PIECE,
    },
    pricePerUnit: {
      type: Number,
      required: false,
      default: 0,
    },
    groceryListId: {
      type: Schema.Types.ObjectId,
      ref: "GroceryList",
      required: true,
    },
    houseId: {
      type: Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    purchasedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null,
    },
    isPurchased: {
      type: Boolean,
      required: true,
      default: false,
    },
    purchasedDate: {
      type: Date,
      required: false,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const GroceryItemModel = mongoose.model<GroceryItemDocument>(
  "GroceryItem",
  groceryItemSchema
);
export default GroceryItemModel;

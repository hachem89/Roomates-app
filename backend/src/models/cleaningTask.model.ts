import mongoose, { Document, Schema } from "mongoose";
import {
  CleaningTasks,
  CleaningTaskStatus,
  CleaningTaskStatusType,
  CleaningTasksType,
} from "../constants/cleaningTask.constant";
import { generateTaskCode } from "../utils/uuid";

export interface CleaningTaskDocument extends Document {
  taskCode: string;
  tasks: Array<CleaningTasksType>;
  assignedTo: mongoose.Types.ObjectId[];
  houseId: mongoose.Types.ObjectId;
  date: Date;
  status: CleaningTaskStatusType;
  createdAt: Date;
  updatedAt: Date;
}

const cleaningTasksSchema = new Schema<CleaningTaskDocument>(
  {
    taskCode: {
      type: String,
      unique: true,
      default: generateTaskCode,
    },
    tasks: {
      type: [String],
      enum: Object.values(CleaningTasks),
      required: true
    },
    assignedTo: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    houseId: {
      type: Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CleaningTaskStatus),
      required: true,
      default: CleaningTaskStatus.TODO,
    },
  },
  {
    timestamps: true,
  }
);

const CleaningTaskModel = mongoose.model<CleaningTaskDocument>(
  "CleaningTask",
  cleaningTasksSchema
);

export default CleaningTaskModel;

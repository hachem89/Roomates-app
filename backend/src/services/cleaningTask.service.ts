import CleaningTaskModel from "../models/cleaningTask.model";
import MemberModel from "../models/member.model";
import { ForbiddenException } from "../utils/appError";

export const createCleaningTaskService = async (
  houseId: string,
  body: {
    tasks: string[];
    assignedTo: string[];
    date: string;
  }
) => {
  const { tasks, assignedTo, date } = body;

  const memberChecks = await MemberModel.find({
    houseId,
    userId: { $in: assignedTo },
  }).select("userId");

  const validUserIds = memberChecks.map((m) => m.userId.toString());

  // Check if any assignedTo users are not part of the house
  const invalidUsers = assignedTo.filter((id) => !validUserIds.includes(id));

  if (invalidUsers.length > 0) {
    throw new ForbiddenException(
      "Some assigned users are not members of this house"
    );
  }

  const cleaningTask = new CleaningTaskModel({
    tasks,
    assignedTo,
    houseId,
    date,
  });

  await cleaningTask.save();

  return {
    cleaningTask,
  };
};


export const getAllCleaningTasksInHouseService = async (houseId: string) => {
  const cleaningTasks = await CleaningTaskModel.find({ houseId }).populate(
    "assignedTo",
    "_id name profilePicture -password"
  );

  return {
    cleaningTasks,
  };
};

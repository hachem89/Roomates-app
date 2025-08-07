import CleaningTaskModel from "../models/cleaningTask.model";
import MemberModel from "../models/member.model";
import { ForbiddenException, NotFoundException } from "../utils/appError";

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

export const getAllCleaningTasksInHouseService = async (
  houseId: string,
  filters: {
    status?: string[];
    assignedTo?: string[];
    keyword?: string;
    date?: string;
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const query: Record<string, any> = {
    houseId: houseId,
  };

  if (filters.status && filters.status?.length > 0) {
    query.status = { $in: filters.status };
  }

  if (filters.assignedTo && filters.assignedTo?.length > 0) {
    query.assignedTo = { $in: filters.assignedTo };
  }

  if (filters.keyword && filters.keyword !== undefined) {
    query.tasks = {
      $elemMatch: {
        $regex: filters.keyword,
        $options: "i",
      },
    };
  }

  if (filters.date) {
    query.date = { $eq: new Date(filters.date) };
  }

  // pagination setup
  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const [cleaningTasks, totalCount] = await Promise.all([
    CleaningTaskModel.find(query)
      .skip(skip)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .populate("assignedTo", "_id name profilePicture -password"),
    CleaningTaskModel.countDocuments(query),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    cleaningTasks,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getCleaningTaskInHouseByIdService = async (
  cleaningTaskId: string,
  houseId: string
) => {
  const cleaningTask = await CleaningTaskModel.findOne({
    _id: cleaningTaskId,
    houseId,
  }).populate("assignedTo", "_id name profilePicture -password");

  if (!cleaningTask) {
    throw new NotFoundException("Cleaning Task not found");
  }

  return {
    cleaningTask,
  };
};

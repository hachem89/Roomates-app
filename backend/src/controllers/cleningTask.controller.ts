import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { houseIdSchema } from "../validation/house.validation";
import { getMemberRoleInHouse } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../constants/role.constant";
import { HTTPSTATUS } from "../constants/httpStatus.constant";
import {
  createCleaningTaskService,
  getAllCleaningTasksInHouseService,
} from "../services/cleaningTask.service";
import { createCleaningTaskSchema } from "../validation/cleaningTask.validation";

export const createCleaningTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);
    const userId = req.user?._id;

    const body = createCleaningTaskSchema.parse(req.body);

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.CREATE_CLEANING_TASK]);

    const { cleaningTask } = await createCleaningTaskService(houseId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Task created successfully",
      cleaningTask,
    });
  }
);

export const getCleaningTasksInHouseByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const updateCleaningTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

// add filtering and pagination
export const getAllCleaningTasksInHouseController = asyncHandler(
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const filters = {
      status: req.query.status
        ? (req.query.status as string)?.split(",")
        : undefined,
      assignedTo: req.query.assignedTo
        ? (req.query.assignedTo as string).split(",")
        : undefined,
      keyword: req.query.keyword as string | undefined,
      date: req.query.date as string | undefined,
    };

    const pagination = {
      pageSize: parseInt(req.query.pageSize as string) || 10,
      pageNumber: parseInt(req.query.pageNumber as string) || 1
    }

    const result = await getAllCleaningTasksInHouseService(houseId, filters, pagination);

    return res.status(HTTPSTATUS.OK).json({
      message: "All cleaning tasks fetched successfully",
      ...result,
    });
  }
);

export const deleteCleaningTaskByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

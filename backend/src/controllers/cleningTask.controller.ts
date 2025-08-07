import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { houseIdSchema } from "../validation/house.validation";
import { getMemberRoleInHouse } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../constants/role.constant";
import { HTTPSTATUS } from "../constants/httpStatus.constant";
import { createCleaningTaskService, getAllCleaningTasksInHouseService } from "../services/cleaningTask.service";
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

export const getAllCleaningTasksInHouseController = asyncHandler(
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { cleaningTasks } = await getAllCleaningTasksInHouseService(houseId);

    return res.status(HTTPSTATUS.OK).json({
      message: "All cleaning tasks fetched successfully",
      cleaningTasks,
    });
  }
);

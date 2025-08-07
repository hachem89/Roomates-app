import { Router } from "express";
import {
  createCleaningTaskController,
  deleteCleaningTaskByIdController,
  getAllCleaningTasksInHouseController,
  getCleaningTaskInHouseByIdController,
  updateCleaningTaskByIdController,
} from "../controllers/cleningTask.controller";

const cleaningTaskRoutes = Router();

// done
cleaningTaskRoutes.post("/house/:houseId/create", createCleaningTaskController);

cleaningTaskRoutes.put(
  "/:cleaningTaskId/house/:houseId/update",
  updateCleaningTaskByIdController
);

cleaningTaskRoutes.delete(
  "/:cleaningTaskId/house/:houseId/delete",
  deleteCleaningTaskByIdController
);


cleaningTaskRoutes.get(
  "/:cleaningTaskId/house/:houseId",
  getCleaningTaskInHouseByIdController
);

// done
cleaningTaskRoutes.get(
  "/house/:houseId/all",
  getAllCleaningTasksInHouseController
);

export default cleaningTaskRoutes;

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

// done
cleaningTaskRoutes.put(
  "/:cleaningTaskId/house/:houseId/update",
  updateCleaningTaskByIdController
);

// done
cleaningTaskRoutes.delete(
  "/:cleaningTaskId/house/:houseId/delete",
  deleteCleaningTaskByIdController
);

// done
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

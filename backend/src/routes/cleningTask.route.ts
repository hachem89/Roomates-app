import { Router } from "express";
import { createCleaningTaskController, getAllCleaningTasksInHouseController } from "../controllers/cleningTask.controller";

const cleaningTaskRoutes = Router()

cleaningTaskRoutes.post("/house/:houseId/create", createCleaningTaskController)

cleaningTaskRoutes.get("/house/:houseId/all", getAllCleaningTasksInHouseController)

export default cleaningTaskRoutes
import { Router } from "express";
import { getAllCleaningTasksInHouseController } from "../controllers/cleningTask.controller";

const cleaningTaskRoutes = Router()

cleaningTaskRoutes.get("/house/:houseId/all", getAllCleaningTasksInHouseController)

export default cleaningTaskRoutes
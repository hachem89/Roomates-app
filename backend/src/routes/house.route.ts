import { Router } from "express";
import {
  changeHouseMemberRoleController,
  createHouseController,
  deleteHouseByIdController,
  getAllHousesUserIsMemberController,
  getHouseAnalyticsController,
  getHouseByIdController,
  getHouseMembersController,
  updateHouseByIdController,
} from "../controllers/house.controller";

const houseRoutes = Router();

houseRoutes.post("/create/new", createHouseController);

houseRoutes.put("/update/:houseId", updateHouseByIdController);

houseRoutes.put(
  "/change/member/role/:houseId",
  changeHouseMemberRoleController
);

houseRoutes.delete("/delete/:houseId", deleteHouseByIdController);

houseRoutes.get("/all", getAllHousesUserIsMemberController);

houseRoutes.get("/members/:houseId", getHouseMembersController);

houseRoutes.get("/analytics/:houseId", getHouseAnalyticsController);

houseRoutes.get("/:houseId", getHouseByIdController);

export default houseRoutes;

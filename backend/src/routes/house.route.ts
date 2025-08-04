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

// done
houseRoutes.post("/create/new", createHouseController);
// done
houseRoutes.put("/update/:houseId", updateHouseByIdController);

// done
houseRoutes.put(
  "/change/member/role/:houseId",
  changeHouseMemberRoleController
);

// done
houseRoutes.delete("/delete/:houseId", deleteHouseByIdController);

// done
houseRoutes.get("/all", getAllHousesUserIsMemberController);

// done
houseRoutes.get("/members/:houseId", getHouseMembersController);

// done 
houseRoutes.get("/:houseId", getHouseByIdController);

houseRoutes.get("/analytics/:houseId", getHouseAnalyticsController);

export default houseRoutes;

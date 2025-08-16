import { Router } from "express";
import {
  addGroceryItemToGroceryListController,
  createGroceryListController,
  deleteGroceryItemByIdController,
  deleteGroceryListByIdController,
  getAllGroceriesOfGroceryListController,
  getAllGroceriesOfHouseController,
  getAllGroceryListsController,
  getGroceryItemByIdController,
  getGroceryListByIdController,
  updateGroceryItemByIdController,
  updateGroceryListByIdController,
} from "../controllers/grocery.controller";

const groceryRoutes = Router();

// done
// get a grocery list in a house by groceryListId with its groceries
groceryRoutes.get(
  "/:groceryListId/house/:houseId",
  getGroceryListByIdController
);

// done
// get all grocery lists of a house without groceries 
groceryRoutes.get("/house/:houseId/all", getAllGroceryListsController);

// done
// create grocery list 
groceryRoutes.post("/house/:houseId/create", createGroceryListController);

// done
// update grocery list details
groceryRoutes.patch(
  "/:groceryListId/house/:houseId/update",
  updateGroceryListByIdController
);

// done
// delete grocery list by id
groceryRoutes.delete(
  "/:groceryListId/house/:houseId/delete",
  deleteGroceryListByIdController
);

// GROCERIES

// get all groceries of a grocery list
groceryRoutes.get(
  "/:groceryListId/house/:houseId/groceries/all",
  getAllGroceriesOfGroceryListController
);

// get grocery item by id
groceryRoutes.get(
  "/:groceryListId/house/:houseId/groceries/:groceryItemId",
  getGroceryItemByIdController
);

// get all groceries in a house and group them by name and filter by date (from --/--/-- to --/--/--)
groceryRoutes.get(
  "/house/:houseId/groceries/all",
  getAllGroceriesOfHouseController
);

// add groceries to a grocery list
groceryRoutes.post(
  "/:groceryListId/house/:houseId/groceries/add",
  addGroceryItemToGroceryListController
);

// update grocery item details
groceryRoutes.patch(
  "/:groceryListId/house/:houseId/groceries/:groceryItemId/update",
  updateGroceryItemByIdController
);

// delete grocery item by id
groceryRoutes.delete(
  "/:groceryListId/house/:houseId/groceries/:groceryItemId/delete",
  deleteGroceryItemByIdController
);

export default groceryRoutes;

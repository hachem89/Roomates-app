import { Router } from "express";
import {
  addGroceryItemToGroceryListController,
  createGroceryListController,
  deleteGroceryItemByIdController,
  deleteGroceryListByIdController,
  getAllGroceriesOfGroceryListController,
  getAllGroceryListsController,
  getGroceryItemByIdController,
  getGroceryListByIdController,
  updateGroceryItemByIdController,
  updateGroceryListByIdController,
} from "../controllers/grocery.controller";

const groceryRoutes = Router();

// done
// get a grocery list in a house by groceryListId
groceryRoutes.get(
  "/:groceryListId/house/:houseId",
  getGroceryListByIdController
);

// done
// get all grocery lists of a house 
groceryRoutes.get(
  "/house/:houseId/all",
  getAllGroceryListsController
);

// done
// create grocery list
groceryRoutes.post("/house/:houseId/create", createGroceryListController);

// update grocery list details
groceryRoutes.patch(
  "/:groceryListId/house/:houseId/update",
  updateGroceryListByIdController
);

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

export default groceryRoutes
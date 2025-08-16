import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { houseIdSchema } from "../validation/house.validation";
import {
  billIdSchema,
  createBillSchema,
  updateBillSchema,
} from "../validation/bill.validation";
import { getMemberRoleInHouse } from "../services/member.service";
import { roleGuard } from "../utils/roleGuard";
import { Permissions } from "../constants/role.constant";
import { HTTPSTATUS } from "../constants/httpStatus.constant";
import {
  createGroceryListService,
  deleteGroceryListByIdService,
  getAllGroceryListsService,
  getGroceryListByIdService,
  updateGroceryListByIdService,
} from "../services/grocery.service";

// done: return grocery list details with its groceries
export const getGroceryListByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);
    const groceryListId = billIdSchema.parse(req.params.groceryListId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { groceryList, groceries } = await getGroceryListByIdService(
      groceryListId,
      houseId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Grocery List fetched successfully",
      groceryList,
      groceries,
    });
  }
);

// done: return all grocery lists of a house without groceries
export const getAllGroceryListsController = asyncHandler(
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { groceryLists } = await getAllGroceryListsService(houseId);

    return res.status(HTTPSTATUS.OK).json({
      message: "All Grocery Lists fetched successfully",
      groceryLists,
    });
  }
);

// done: create new grocery list
export const createGroceryListController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = createBillSchema.parse(req.body);
    const houseId = houseIdSchema.parse(req.params.houseId);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.CREATE_GROCERY_LIST]);

    const { groceryList } = await createGroceryListService(
      userId,
      houseId,
      body
    );

    return res.status(HTTPSTATUS.CREATED).json({
      message: "Grocery List created successfully",
      groceryList,
    });
  }
);

// update grocery list
export const updateGroceryListByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateBillSchema.parse(req.body);

    const userId = req.user?._id;

    const houseId = houseIdSchema.parse(req.params.houseId);
    const groceryListId = billIdSchema.parse(req.params.groceryListId);

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.EDIT_GROCERY_LIST]);

    const { updatedGroceryList, groceries } = await updateGroceryListByIdService(
      houseId,
      groceryListId,
      body
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Grocery list updated successfully",
      updatedGroceryList,
      groceries
    })
  }
);

// done
export const deleteGroceryListByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    // delete the grocery list and its groceries
    const houseId = houseIdSchema.parse(req.params.houseId);
    const groceryListId = billIdSchema.parse(req.params.groceryListId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.DELETE_GROCERY_LIST]);

    await deleteGroceryListByIdService(groceryListId, houseId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Grocery List deleted successfully",
    });
  }
);

// do i need it seperatly or i just return them when fetching a grocery list
// i can do getAllGroceries of a house and group them by name for statistics
export const getAllGroceriesOfGroceryListController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const getGroceryItemByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const getAllGroceriesOfHouseController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const addGroceryItemToGroceryListController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const updateGroceryItemByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const deleteGroceryItemByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

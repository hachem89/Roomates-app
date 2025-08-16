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
  addGroceryItemToGroceryListService,
  createGroceryListService,
  deleteGroceryListByIdService,
  getAllGroceriesOfGroceryListService,
  getAllGroceriesOfHouseService,
  getAllGroceryListsService,
  getGroceryItemByIdService,
  getGroceryListByIdService,
  updateGroceryListByIdService,
} from "../services/grocery.service";
import {
  addGroceryItemSchema,
  groceryItemIdSchema,
} from "../validation/groceryItem.validation";

// done: return grocery list details with its groceries
export const getGroceryListByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);
    const groceryListId = billIdSchema.parse(req.params.groceryListId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { groceryList, groceries, numberOfGroceries } =
      await getGroceryListByIdService(groceryListId, houseId);

    return res.status(HTTPSTATUS.OK).json({
      message: "Grocery List fetched successfully",
      groceryList,
      numberOfGroceries,
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

// done: update grocery list
export const updateGroceryListByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = updateBillSchema.parse(req.body);

    const userId = req.user?._id;

    const houseId = houseIdSchema.parse(req.params.houseId);
    const groceryListId = billIdSchema.parse(req.params.groceryListId);

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.EDIT_GROCERY_LIST]);

    const { updatedGroceryList, groceries } =
      await updateGroceryListByIdService(houseId, groceryListId, body);

    return res.status(HTTPSTATUS.OK).json({
      message: "Grocery list updated successfully",
      updatedGroceryList,
      groceries,
    });
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

// -------------groceries----------

// do i need it seperatly or i just return them when fetching a grocery list
// i can do getAllGroceries of a house and group them by name for statistics
// done
export const getAllGroceriesOfGroceryListController = asyncHandler(
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);
    const groceryListId = billIdSchema.parse(req.params.groceryListId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { groceries } = await getAllGroceriesOfGroceryListService(
      groceryListId,
      houseId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Groceries fetched successfully",
      groceries,
    });
  }
);

// done
export const getGroceryItemByIdController = asyncHandler(
  async (req: Request, res: Response) => {
    const groceryItemId = groceryItemIdSchema.parse(req.params.groceryItemId);
    const houseId = houseIdSchema.parse(req.params.houseId);
    const groceryListId = billIdSchema.parse(req.params.groceryListId);
    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const { grocery } = await getGroceryItemByIdService(
      groceryItemId,
      groceryListId,
      houseId
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Grocery item fetched successfully",
      grocery,
    });
  }
);

// done: sort by just totalQuantity (modify it so it can be sorted by totalQuantit or totalPrice) + filter by purchasedDate
export const getAllGroceriesOfHouseController = asyncHandler(
  async (req: Request, res: Response) => {
    const houseId = houseIdSchema.parse(req.params.houseId);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.VIEW_ONLY]);

    const filters = {
      startDate: req.query.startDate as string | undefined, 
      endDate: req.query.endDate as string | undefined, 
    }

    const {groceries} = await getAllGroceriesOfHouseService(houseId, filters)

    return res.status(HTTPSTATUS.OK).json({
      message: "All Groceries of the house fetched successfully",
      groceries,
    });

  }
);

// done
export const addGroceryItemToGroceryListController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = addGroceryItemSchema.parse(req.body);

    const houseId = houseIdSchema.parse(req.params.houseId);

    const groceryListId = billIdSchema.parse(req.params.groceryListId);

    const userId = req.user?._id;

    const { role } = await getMemberRoleInHouse(userId, houseId);
    roleGuard(role, [Permissions.ADD_GROCERY_ITEM]);

    const { grocery } = await addGroceryItemToGroceryListService(
      groceryListId,
      houseId,
      body
    );

    return res.status(HTTPSTATUS.OK).json({
      message: "Grocery item added to the list successfully",
      grocery,
    });
  }
);

export const updateGroceryItemByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const deleteGroceryItemByIdController = asyncHandler(
  async (req: Request, res: Response) => {}
);

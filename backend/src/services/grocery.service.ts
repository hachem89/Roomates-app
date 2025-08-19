import mongoose from "mongoose";
import { BillCategory } from "../constants/bill-category.constant";
import BillModel from "../models/bill.model";
import GroceryItemModel from "../models/groceryItem.model";
import { BadRequestException, NotFoundException } from "../utils/appError";
import {
  createBillInputType,
  updateBillInputType,
} from "../validation/bill.validation";
import { getMemberRoleInHouse } from "./member.service";
import {
  addGroceryItemInputType,
  updateGroceryItemInputType,
} from "../validation/groceryItem.validation";
import {
  calculateAmountPerParticipantOfBill,
  updateTotalPrice,
} from "../utils/bill-util";
import TransactionModel from "../models/transaction.model";

// done
export const getGroceryListByIdService = async (
  groceryListId: string,
  houseId: string
) => {
  const groceryList = await BillModel.findById(groceryListId)
    .populate("participants.participant", "name -password")
    .populate("createdBy", "name -password");

  if (!groceryList) {
    throw new NotFoundException("Grocery list not found");
  }

  const groceries = await GroceryItemModel.find({
    groceryListId,
    houseId,
  }).populate("purchasedBy", "name -password");

  const numberOfGroceries = groceries.length;

  return {
    groceryList,
    numberOfGroceries,
    groceries,
  };
};

// done
export const getAllGroceryListsService = async (houseId: string) => {
  const groceryLists = await BillModel.find({
    category: BillCategory.GROCERY_LIST,
    houseId,
  }).populate("createdBy", "name -password");

  if (!groceryLists) {
    throw new NotFoundException("Grocery lists not found check houseId");
  }

  return {
    groceryLists,
  };
};

// done
export const createGroceryListService = async (
  userId: string,
  houseId: string,
  body: createBillInputType
) => {
  // verify participants are house members
  const { participants } = body;
  await Promise.all(
    participants.map((p) => getMemberRoleInHouse(p.participant, houseId))
  );

  const groceryList = new BillModel({
    ...body,
    houseId,
    createdBy: userId,
  });
  await groceryList.save();

  return {
    groceryList,
  };
};

// done
export const deleteGroceryListByIdService = async (
  groceryListId: string,
  houseId: string
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const groceryList = await BillModel.findOne({
      _id: groceryListId,
      houseId,
      category: BillCategory.GROCERY_LIST,
    }).session(session);

    if (!groceryList) {
      throw new NotFoundException("Grocery list not found");
    }

    await GroceryItemModel.deleteMany({ groceryListId }).session(session);

    await TransactionModel.deleteMany({ billId: groceryList._id, houseId }).session(
      session
    );

    await groceryList.deleteOne({ session });

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// done
export const updateGroceryListByIdService = async (
  houseId: string,
  groceryListId: string,
  body: updateBillInputType
) => {
  // verify participants are house members
  const { participants } = body;
  if (participants) {
    await Promise.all(
      participants.map((p) => getMemberRoleInHouse(p.participant, houseId))
    );
  }

  const updatedGroceryList = await BillModel.findOneAndUpdate(
    { _id: groceryListId, houseId },
    { $set: body },
    { new: true }
  );

  if (!updatedGroceryList) {
    throw new NotFoundException("Grocery list not found");
  }

  const groceries = await GroceryItemModel.find({
    groceryListId,
    houseId,
  });

  return {
    updatedGroceryList,
    groceries,
  };
};

// done (missing pagination + filtering + searching)
export const getAllGroceriesOfGroceryListService = async (
  groceryListId: string,
  houseId: string
) => {
  const groceries = await GroceryItemModel.find({
    groceryListId,
    houseId,
  });

  if (!groceries) {
    throw new NotFoundException(
      "Groceries not found or wrong grocery list/house"
    );
  }

  return {
    groceries,
  };
};

// done
export const addGroceryItemToGroceryListService = async (
  groceryListId: string,
  houseId: string,
  body: addGroceryItemInputType
) => {
  const { name } = body;

  const groceryList = await BillModel.findOne({
    _id: groceryListId,
    category: BillCategory.GROCERY_LIST,
    houseId,
  });
  if (!groceryList) {
    throw new NotFoundException("Grocery list not found or wrong house");
  }

  const existingItemInList = await GroceryItemModel.findOne({
    name,
    groceryListId,
    houseId,
  });

  if (existingItemInList) {
    throw new BadRequestException(
      "Item is already in list just increase its quantity"
    );
  }

  const newItem = new GroceryItemModel({
    ...body,
    groceryListId,
    houseId,
  });
  await newItem.save();

  // if the quantity and price per unit are provided from the start:
  // update the totalPrice and amout per participant
  if (newItem.quantity && newItem.pricePerUnit) {
    await updateTotalPrice(
      groceryList,
      newItem.quantity * newItem.pricePerUnit
    );
    await calculateAmountPerParticipantOfBill(groceryList);
  }

  return {
    grocery: newItem,
  };
};

// done
export const getGroceryItemByIdService = async (
  groceryItemId: string,
  groceryListId: string,
  houseId: string
) => {
  const groceryItem = await GroceryItemModel.findOne({
    _id: groceryItemId,
    groceryListId,
    houseId,
  });

  if (!groceryItem) {
    throw new NotFoundException(
      "Grocery item not found or wrong grocery list/house"
    );
  }

  return {
    grocery: groceryItem,
  };
};

// done: sort by just totalQuantity (modify it so it can be sorted by totalQuantit or totalPrice) and filter by purchasedDate
export const getAllGroceriesOfHouseService = async (
  houseId: string,
  filters: {
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }
) => {
  const match: Record<string, any> = {
    houseId: new mongoose.Types.ObjectId(houseId),
  };

  if (filters.startDate || filters.endDate) {
    match.purchasedDate = {};
  }

  if (filters.startDate) {
    match.purchasedDate.$gte = new Date(filters.startDate);
  }

  if (filters.endDate) {
    match.purchasedDate.$lte = new Date(filters.endDate);
  }

  // sortBy can be "name", "totalQuantity", "totalSpent"
  // sortOrder is "1" (asc) or "-1" (desc)
  const { sortBy = "name", sortOrder = "asc" } = filters;

  const sortFieldMap: Record<string, string> = {
    name: "name",
    totalQuantity: "totalQuantity",
    totalSpent: "totalSpent",
  };
  const sortField = sortFieldMap[sortBy] || "name";

  const groupedGroceries = await GroceryItemModel.aggregate([
    {
      $match: match,
    },
    {
      $group: {
        _id: {
          name: "$name",
          packageSize: "$packageSize",
        },
        totalQuantity: { $sum: "$quantity" },
        totalSpent: { $sum: { $multiply: ["$pricePerUnit", "$quantity"] } },
      },
    },
    {
      $project: {
        _id: 0,
        name: "$_id.name",
        packageSize: "$_id.packageSize",
        totalQuantity: 1,
        totalSpent: 1,
      },
    },
    {
      $sort: { [sortField]: sortOrder === "desc" ? -1 : 1 },
    },
  ]);

  return {
    groceries: groupedGroceries,
  };
};

export const updateGroceryItemByIdService = async (
  groceryItemId: string,
  groceryListId: string,
  houseId: string,
  body: updateGroceryItemInputType
) => {
  const groceryList = await BillModel.findOne({
    _id: groceryListId,
    category: BillCategory.GROCERY_LIST,
    houseId,
  });

  if (!groceryList) {
    throw new NotFoundException("Grocery list not found");
  }

  const oldGroceryItem = await GroceryItemModel.findOne({
    _id: groceryItemId,
    groceryListId,
    houseId,
  });

  if (!oldGroceryItem) {
    throw new NotFoundException("Grocery item not found");
  }

  // if purchasedBy updated or purchasedDate then automatically mark the grocery item as purchased:
  if ((body.purchasedBy || body.purchasedDate) && !body.isPurchased) {
    if (body.purchasedBy) {
      await getMemberRoleInHouse(body.purchasedBy, houseId);
    }
    body.isPurchased = true;
  }

  // update the purchasedDate if ( purchasedBy is provided or it is purchased )and purchasedDate not provided
  if ((body.purchasedBy || body.isPurchased) && !body.purchasedDate) {
    body.purchasedDate = new Date().toISOString();
  }

  const updatedGroceryItem = await GroceryItemModel.findOneAndUpdate(
    {
      _id: groceryItemId,
      groceryListId,
      houseId,
    },
    {
      $set: body,
    },
    {
      new: true,
    }
  );

  if (!updatedGroceryItem) {
    throw new BadRequestException("Failed to update grocery item");
  }

  // update the totalPrice of the list if quantity or ppu has changed
  if ("quantity" in body || "pricePerUnit" in body) {
    const change =
      updatedGroceryItem.quantity * updatedGroceryItem.pricePerUnit -
      oldGroceryItem.quantity * oldGroceryItem.pricePerUnit;
    await updateTotalPrice(groceryList, change);
    await calculateAmountPerParticipantOfBill(groceryList);
  }

  return {
    grocery: updatedGroceryItem,
  };
};

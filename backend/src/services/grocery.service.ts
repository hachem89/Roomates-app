import { BillCategory } from "../constants/bill-category.constant";
import BillModel from "../models/bill.model";
import GroceryItemModel from "../models/groceryItem.model";
import { NotFoundException } from "../utils/appError";
import { createBillInputType } from "../validation/bill.validation";
import { getMemberRoleInHouse } from "./member.service";

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

  return {
    groceryList,
    groceries,
  };
};

export const getAllGroceryListsService = async (houseId: string) => {
  const groceryLists = await BillModel.find({
    category: BillCategory.GROCERY_LIST,
    houseId,
  }).populate("createdBy","name -password");

  if (!groceryLists) {
    throw new NotFoundException("Grocery lists not found check houseId");
  }

  return {
    groceryLists,
  };
};

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

import {
  BillCategory,
  BillCategoryType,
} from "../constants/bill-category.constant";
import BillModel from "../models/bill.model";
import GroceryItemModel from "../models/groceryItem.model";
import MemberModel from "../models/member.model";
import { ParticipantDocument } from "../models/participant.model";
import { ForbiddenException, NotFoundException } from "../utils/appError";
import { createBillInputType } from "../validation/bill.validation";
import { getMemberRoleInHouse } from "./member.service";

export const getGroceryListByIdService = async (
  groceryListId: string,
  houseId: string
) => {
  const groceryList = await BillModel.findById({
    groceryListId,
  }).populate("paticipants");

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
  });

  if (!groceryLists) {
    throw new NotFoundException("Grocery lists not found check houseId");
  }

  return {
    groceryLists,
  };
};

// see how to change it so it automatically set the amount to 0 without sending it from the client:
// https://chatgpt.com/s/t_6899444420848191bf141435ccdab335
export const createGroceryListService = async (
  userId: string,
  houseId: string,
  body: createBillInputType
) => {
  // verify participants are house members
  const { participants } = body;
  await Promise.all(
    participants.map((p) => getMemberRoleInHouse(p.userId, houseId))
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

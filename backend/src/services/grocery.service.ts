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
import { addGroceryItemInputType } from "../validation/groceryItem.validation";

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


export const getAllGroceriesOfGroceryListService = async (
  groceryListId: string,
  houseId: string
) => {
  const groceries = await GroceryItemModel.find({
    groceryListId,
    houseId,
  })

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

  // update the totalPrice and amout per participant
  groceryList.totalPrice += newItem.quantity * newItem.pricePerUnit;

  groceryList.participants.forEach(p=>{
    p.amount = groceryList.totalPrice / groceryList.participants.length
  })
  await groceryList.save()

  return {
    grocery: newItem,
  };
};

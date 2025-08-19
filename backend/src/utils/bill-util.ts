import mongoose from "mongoose";
import { BillCategory } from "../constants/bill-category.constant";
import { BillDocument } from "../models/bill.model";
import { GroceryItemDocument } from "../models/groceryItem.model";

// export const updateTotalPrice = async (
//   groceryList: BillDocument,
//   price: number
// ) => {
//   groceryList.totalPrice += price;
//   await groceryList.save();
// };

// // this is when: create, update bill / add, delete participant
// export const calculateAmountPerParticipantOfBill = async (
//   bill: BillDocument
// ) => {
//   const billPrice = bill.totalPrice;
//   const numberOfParticipants = bill.participants.length;
//   bill.participants.forEach((p) => {
//     p.amount = billPrice / numberOfParticipants;
//   });
//   await bill.save();
// };

// this is not necessary
// this is when:
// add grocery item : (groceryList, groceryItem.quantity*groceryItem.pricePerUnit)
// remove grocery item : (groceryList, -(groceryItem.quantity*groceryItem.pricePerUnit))
// update (quantity || pricePerUnit) of groceryItem: (groceryList, (updatedGroceryItem.quantity * updatedGroceryItem.pricePerUnit)-(oldGroceryItem.quantity * oldGroceryItem.pricePerUnit))
// export const calculateAmountPerParticipantOfGroceryList = async (
//   groceryList: BillDocument,
//   priceOfGroceryItem: number
// ) => {
//   groceryList.participants.forEach((p) => {
//     p.amount += priceOfGroceryItem / groceryList.participants.length;
//   });
//   await groceryList.save();
// };




// export const updateAmountOfPurchaser = async (
//   groceryList: BillDocument,
//   purchasedBy: string,
//   groceryItem: GroceryItemDocument
// ) => {
//   const purchaserId = new mongoose.Types.ObjectId(purchasedBy);
//   const participant = groceryList.participants.find((p) =>
//     p.participant.equals(purchaserId)
//   );

//   //   if (participant) {
//   //     const totalPricePaid = groceryItems.reduce((accumulator, groceryItem) => {
//   //       return accumulator + groceryItem.quantity * groceryItem.pricePerUnit;
//   //     }, 0);

//   if (participant) {
//     participant.amount -= groceryItem.quantity * groceryItem.pricePerUnit;
//     await groceryList.save();
//   }
// };


export const updateTotalPriceAndAmountPerParticipant = async (
  bill: BillDocument,
  price: number
) => {
  bill.totalPrice += price;

  const billPrice = bill.totalPrice;
  const numberOfParticipants = bill.participants.length;
  
  bill.participants.forEach((p) => {
    p.amount = billPrice / numberOfParticipants;
  });

  await bill.save();
};
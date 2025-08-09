import mongoose, { Schema, Document } from "mongoose";
import {
  BillCategory,
  BillCategoryType,
} from "../constants/bill-category.constant";
import { ParticipantDocument, participantSchema } from "./participant.model";

export interface BillDocument extends Document {
  title: string;
  category: BillCategoryType;
  houseId: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  totalPrice: number;
  participants: Array<ParticipantDocument>;
  dueDate?: Date;
  isPaid: boolean;
  isSettled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const billSchema = new Schema<BillDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: Object.values(BillCategory),
      required: true,
    },
    houseId: {
      type: Schema.Types.ObjectId,
      ref: "House",
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    totalPrice: {
      type: Number,
      required: false,
      default: 0,
    },
    participants: {
      type: [participantSchema],
      required: true,
    },
    dueDate: {
      type: Date,
      required: false,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isSettled: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const BillModel = mongoose.model<BillDocument>("Bill", billSchema);
export default BillModel;

/*
{

GroceryIetm:{
        price
        groceryList
        purchasedBy
        .....
        }

BillModal:{
        category
        totalAmount
        participants:[{
          name: 
          amount: (0 is default)(totalPrice / number of participants)
          }]
          .....
      }

TransactionModel:{
  billId:
  from:
  to:
  amount:
}

the flow:
1) create a grocery list -> send the {title, [participants ids], category} in the body 
2) in the app, the user will be redirected to a page like a note to add groceries to the list
3) add grocery items one by one -> send the {name, quantity, unit, pricePu} in the body
      and update the totalPrice of the list
          update the share of each participant (totalPrice / number of participants)

4) while shopping, the user opens the groceryList 
        4.1) and mark the items bought and 
        4.2) tells the item is bought by whom
        4.3) in this process the amount of money in bill.participants.amount will decrease by the item.price*quantity
        *he can also add new items (step 3) 
            (in case of doing 4.3 and then the user add new item to the list and repeat the step 3,
             there will be a mistake because this will overwrite the calculations of step number 4.3,
             so by default the amount of each participant will be 0 and then add the equat share,
             so it's basically a add operation)

5) once shopping is done the user:
   5.1) can delete the items that are not bought
        -> update the totalPrice of the list and the amount of each participant
  5.2) mark the groceryList as isBought without the settlement of the debts (if the debts exist)
       this will update the UI like putting a yellow circle in front of the groceryList name for example
       then the server will Generate the minimal set of “A owes B” payments by using the minimum cash flow graph algorithm and will be stored in the Transactions collection. 
       once all debts are setlled, the isSettled field of the GroceryList will be updated to true and then the list will turn to green for example
       in case of no debts like all the participants already paied the same amount the isSettled will automatically will be marked true and there is no need to use the minimum cash flow graph algorithm  
----------
the same process wil be used for the static bills like electricity, internet, water, rent etc that comes will a predefined price,
tell which persons are conserned with that bill, dueDate, and the participants with their names and amount
and in case of someone or more paied the bill inequally than the server will calculate the minimal set of “A owes B” payments by using the minimum cash flow graph algorithm will be stored in the Transactions collection


}





*/

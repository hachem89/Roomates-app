import { BillDocument } from "../models/bill.model";

export const updateTotalPrice = async(
    groceryList: BillDocument,
    price: number
)=>{
    groceryList.totalPrice += price
    await groceryList.save()
}
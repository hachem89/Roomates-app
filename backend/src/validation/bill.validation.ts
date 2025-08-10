import z from "zod";
import { BillCategory } from "../constants/bill-category.constant";
import { dateSchema } from "./cleaningTask.validation";
import { Units } from "../constants/unit.constant";

// bill's title schema
const titleSchema = z.string().trim().min(1).max(255);

// bill's category schema
const categorySchema = z.enum(
  Object.values(BillCategory) as [string, ...string[]]
);

// total price schema
const totalPriceSchema = z
  .number({
    required_error: "Total amount is required",
    invalid_type_error: "Total amount must be a number",
  })
  .min(0, { message: "Total amount must be >= 0" });

// participants schema
const participantsSchema = z
  .array(
    z.object({
      userId: z.string().trim().min(1, { message: "User id is required" }),
      amount: z.number().min(0, { message: "Should be >= 0" }).optional(),
    })
  )
  .nonempty({ message: "At least one participant is required" });

const quantitySchema = z.number().min(0);

const unitSchema = z.enum(Object.values(Units) as [string, ...string[]]);
const pricePerUnitSchema = z.number().min(0);
const purchasedBySchema = z.string().trim().min(1);

// bill id (it cal also be used for groceryListId)
export const billIdSchema = z.string().trim().min(1);

// grocery item id
export const groceryItemIdSchema = z.string().trim().min(1);

// create bill schema (used also for groceryList)
export const createBillSchema = z.object({
  title: titleSchema,
  category: categorySchema,
  totalPrice: totalPriceSchema,
  participants: participantsSchema,
  dueDate: dateSchema.optional(),
});

export const updateBillSchema = z.object({
  title: titleSchema.optional(),
  category: categorySchema.optional(),
  totalPrice: totalPriceSchema.optional(),
  participants: participantsSchema.optional(),
  dueDate: dateSchema.optional(),
  isPaid: z.boolean().optional(),
  isSettled: z.boolean().optional(),
});

// add grocery item to a groceryList(bill)
export const addGroceryItemSchema = z.object({
  name: titleSchema,
  quantity: quantitySchema.optional(),
  unit: unitSchema.optional(),
  pricePerUnit: pricePerUnitSchema.optional(),
});

// update grocery item schema
export const updateGroceryItemSchema = z.object({
  name: titleSchema.optional(),
  quantity: quantitySchema.optional(),
  unit: unitSchema.optional(),
  pricePerUnit: pricePerUnitSchema.optional(),
  purchasedBy: purchasedBySchema.optional(),
  isPurchased: z.boolean().optional(),
  purchasedDate: dateSchema.optional(),
});

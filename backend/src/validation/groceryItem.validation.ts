import z from "zod";
import { dateSchema } from "./cleaningTask.validation";
import { Units } from "../constants/unit.constant";

const nameSchema = z.string().trim().min(1).max(255);

const quantitySchema = z.number().min(0);

const unitSchema = z.enum(Object.values(Units) as [string, ...string[]]);

const pricePerUnitSchema = z.number().min(0);

const purchasedBySchema = z.string().trim().min(1);

export const groceryItemIdSchema = z.string().trim().min(1);

// add grocery item to a groceryList(bill)
export const addGroceryItemSchema = z.object({
  name: nameSchema,
  quantity: quantitySchema.optional(),
  unit: unitSchema.optional(),
  pricePerUnit: pricePerUnitSchema.optional(),
});

// update grocery item schema
export const updateGroceryItemSchema = z.object({
  name: nameSchema.optional(),
  quantity: quantitySchema.optional(),
  unit: unitSchema.optional(),
  pricePerUnit: pricePerUnitSchema.optional(),
  purchasedBy: purchasedBySchema.optional(),
  isPurchased: z.boolean().optional(),
  purchasedDate: dateSchema.optional(),
});

export type addGroceryItemInputType = z.infer<typeof addGroceryItemSchema>;
export type updateGroceryItemInputType = z.infer<
  typeof updateGroceryItemSchema
>;

import z from "zod";
import { BillCategory } from "../constants/bill-category.constant";
import { dateSchema } from "./cleaningTask.validation";

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
      participant: z
        .string()
        .trim()
        .min(1, { message: "participant id is required" }),
      amount: z.number().min(0, { message: "Should be >= 0" }).optional(),
    })
  )
  .nonempty({ message: "At least one participant is required" });

// bill id (it can also be used for groceryListId)
export const billIdSchema = z.string().trim().min(1);

// create bill schema (used also for groceryList)
export const createBillSchema = z.object({
  title: titleSchema,
  category: categorySchema,
  totalPrice: totalPriceSchema.optional(),
  participants: participantsSchema,
  dueDate: dateSchema.optional(),
});

export const updateBillSchema = z
  .object({
    title: titleSchema.optional(),
    category: categorySchema.optional(),
    totalPrice: totalPriceSchema.optional(),
    participants: participantsSchema.optional(),
    dueDate: dateSchema.optional(),
    isPaid: z.boolean().optional(),
    isSettled: z.boolean().optional(),
  })

// exporting types for input validation:
export type createBillInputType = z.infer<typeof createBillSchema>;
export type updateBillInputType = z.infer<typeof updateBillSchema>;

import z from "zod";

export const nameSchema = z
  .string()
  .trim()
  .min(1, { message: "Name is required" })
  .max(255);

export const descriptionSchema = z.string().trim().optional();

export const houseIdSchema = z
  .string()
  .trim()
  .min(1, { message: "House Id is required" });

export const changeRoleSchema = z.object({
  roleId: z.string().trim().min(1),
  memberId: z.string().trim().min(1),
});

export const createHouseSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

export const updateHouseSchema = z.object({
  name: nameSchema,
  description: descriptionSchema,
});

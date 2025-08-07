import z from "zod";
import {
  CleaningTasks,
  CleaningTasksType,
  CleaningTaskStatus,
} from "../constants/cleaningTask.constant";

/* ----------------------- Common Schemas ----------------------- */

// Assigned to: at least one user, each is a string ID
export const assignedToSchema = z
  .array(z.string().trim().min(1))
  .nonempty("At least one member must be assigned");

// Tasks: array of CleaningTasksType values
export const tasksSchema = z
  .array(z.enum(Object.values(CleaningTasks) as [string, ...string[]]))
  .nonempty("At least one cleaning task is required");

// Status: must be one of CleaningTaskStatus
export const statusSchema = z.enum(
  Object.values(CleaningTaskStatus) as [string, ...string[]]
);

// Date: must be a valid date string (ISO or parseable by Date)
export const dateSchema = z
  .string()
  .trim()
  .refine((val) => !val || !isNaN(Date.parse(val)), {
    message: "Invalid date format. Please provide a valid date string.",
  });

// Cleaning Task ID
export const cleaningTaskIdSchema = z.string().trim().min(1);

/* ----------------------- Main Schemas ----------------------- */

// Create: all fields required
export const createCleaningTaskSchema = z.object({
  tasks: tasksSchema,
  assignedTo: assignedToSchema,
  date: dateSchema,
  // status is optional here — defaults handled in service/model
  status: statusSchema.optional(),
});

// Update: partial update allowed (PATCH semantics)
export const updateCleaningTaskSchema = z.object({
  tasks: tasksSchema.optional(),
  assignedTo: assignedToSchema.optional(),
  status: statusSchema.optional(),
  date: dateSchema.optional(),
});

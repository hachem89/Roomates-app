import z from "zod";
import {
  CleaningTasks,
  CleaningTaskStatus,
} from "../constants/cleaningTask.constant";

export const assignedToSchema = z
  .array(z.string().trim().min(1))
  .nonempty("At least one member must be assigned");

export const tasksSchema = z
  .array(z.enum(Object.values(CleaningTasks) as [string, ...string[]]))
  .nonempty("At least one cleaning task is required");

export const statusSchema = z.enum(
  Object.values(CleaningTaskStatus) as [string, ...string[]]
);

export const dateSchema = z
  .string()
  .trim()
  .refine(
    (val) => {
      return !val || !isNaN(Date.parse(val));
    },
    {
      message: "Invalid date format. Please provide a valid date string.",
    }
  );

export const cleaningTaskIdSchema = z.string().trim().min(1);

export const createCleaningTaskSchema = z.object({
  tasks: tasksSchema,
  assignedTo: assignedToSchema,
  status: statusSchema,
  date: dateSchema,
});

export const updateCleaningTaskSchema = z.object({
  tasks: tasksSchema,
  assignedTo: assignedToSchema,
  status: statusSchema,
  date: dateSchema,
});

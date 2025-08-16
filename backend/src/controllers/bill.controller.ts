import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

export const addParticipantToGroceyListController = asyncHandler(
  async (req: Request, res: Response) => {}
);

export const removeParticipantToGroceyListController = asyncHandler(
  async (req: Request, res: Response) => {}
);

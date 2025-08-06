import CleaningTaskModel from "../models/cleaningTask.model";

export const getAllCleaningTasksInHouseService = async (houseId: string) => {
  const cleaningTasks = await CleaningTaskModel.find({ houseId }).populate(
    "assignedTo",
    "_id name profilePicture"
  );

  return{
    cleaningTasks
  }
};

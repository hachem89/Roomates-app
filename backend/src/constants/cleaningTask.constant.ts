export const CleaningTasks = {
  CLEAN_TOILET: "Clean the toilet",
  CLEAN_BATHROOM: "Clean the bathroom",
  CLEAN_KITCHEN: "Clean the kitchen",
  CLEAN_LIVING_ROOM: "Clean the living room",
  WASH_DISHES: "Wash the dishes",
  TAKE_OUT_TRASH: "Take out the trash",
  SPRING_CLEANING: "Spring cleaning",
} as const;

export type CleaningTasksType =
  (typeof CleaningTasks)[keyof typeof CleaningTasks];

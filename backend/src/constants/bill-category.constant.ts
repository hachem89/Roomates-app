export const BillCategory = {
  GROCERY_LIST: "Grocery list",
  RENT: "Rent",
  INTERNET: "Internet",
  ELECTRICITY: "Electicity",
  ELECTRICITY_GAZ: "Electricity and gaz",
  WATER: "Water",
  OTHER: "Other",
} as const;

export type BillCategoryType = (typeof BillCategory)[keyof typeof BillCategory];

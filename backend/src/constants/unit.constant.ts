export const Units = {
  LITRE: "l",
  MILLILITRE: "m",
  GRAM: "g",
  KILOGRAM: "kg",
  PIECE: "piece",
  PACK: "pack",
  DOZEN: "dozen",
} as const;

export type UnitsType = (typeof Units)[keyof typeof Units];

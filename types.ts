export type WineType = "Red" | "White" | "Rose" | "Sparkling" | "Fortified";

export interface Wine {
  id: string;
  wineName: string;
  wineMaker: string;
  grape: string;
  type: WineType;
  year: number;
  rating: string;
  region: string;
  foodPairings: string[];
  attributeTags: string[];
  labelImage?: string;
  synced?: boolean;
  userId?: string;
  isFavourite?: boolean;
}
export interface User {
  id: string;
  username: string;
  password: string;
  email: string | null;
}

export const FOOD_TAG_OPTIONS = [
  "Cheese",
  "Seafood",
  "Red Meat",
  "Poultry",
  "Spicy",
  "Dessert",
  "Fruits",
  "Vegetarian",
  "Chocolate",
  "Pizza",
  "Pasta",
] as const;

export type FoodTag = (typeof FOOD_TAG_OPTIONS)[number];

export const ATTRIBUTE_TAG_OPTIONS = [
  "Organic",
  "Biodynamic",
  "Sustainable",
  "Natural",
  "Low-Sulfites",
  "Female-Owned",
  "Family-Owned",
  "LGBTQ+-Owned",
  "Single-Vineyard",
  "Reserve",
] as const;
export type AttributeTag = (typeof ATTRIBUTE_TAG_OPTIONS)[number];

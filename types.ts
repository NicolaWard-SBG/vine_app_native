export type WineType = "Red" | "White" | "Rose" | "Sparkling" | "Fortified";

export interface Wine {
  id: number;
  wineName: string;
  grape: string;
  type: WineType;
  year?: number;
  rating?: number;
  region?: string;
}

export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
}

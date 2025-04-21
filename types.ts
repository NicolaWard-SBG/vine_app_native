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
  notes: string;
  labelImage?: string;
  synced?: boolean;
  userId?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  email: string | null;
}

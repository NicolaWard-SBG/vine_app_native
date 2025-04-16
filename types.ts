export type WineType = "Red" | "White" | "Rose" | "Sparkling" | "Fortified";

export interface Wine {
  id: number;
  wineName: string;
  wineMaker: string;
  grape: string;
  type: string;
  year: number;
  rating: string;
  region: string;
  notes: string;
  labelImage?: string;
  synced?: boolean;
  firebaseId?: string;
  userId?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  email: string | null;
}

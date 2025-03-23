export type WineType = "Red" | "White" | "Rose" | "Sparkling" | "Fortified";

export interface Wine {
  id: number;
  wineMaker: string;
  wineName: string;
  grape: string;
  type: WineType;
  year?: number;
  rating?: number;
  region?: string;
  notes?: string;
  labelImage?: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  email: string | null;
}

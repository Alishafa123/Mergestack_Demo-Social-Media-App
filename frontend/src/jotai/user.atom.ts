import { atom } from "jotai";

export interface User {
  id: number;
  email: string;
  name: string;
}

export const userAtom = atom<User | null>(null);

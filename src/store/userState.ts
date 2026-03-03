import type { User } from "firebase/auth";
import { atom } from "nanostores";

type UserState = {
  user: User | null;
};

export const userState = atom<UserState>({
  user: null,
});

export function setUser(user: UserState["user"]): void {
  userState.set({ ...userState.get(), user });
}

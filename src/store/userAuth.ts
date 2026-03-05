import { persistentAtom } from "@nanostores/persistent";

type UserAuthState = {
  userEmail: string | null;
};

export const userAuth = persistentAtom<UserAuthState>(
  "authState",
  {
    userEmail: null,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export function setUserEmail(userEmail: UserAuthState["userEmail"]): void {
  userAuth.set({ ...userAuth.get(), userEmail });
}

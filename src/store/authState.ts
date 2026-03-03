import { persistentAtom } from "@nanostores/persistent";

type AuthState = {
  userEmail: string | null;
};

export const authState = persistentAtom<AuthState>(
  "authState",
  {
    userEmail: null,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export function setUserEmail(userEmail: AuthState["userEmail"]): void {
  authState.set({ ...authState.get(), userEmail });
}

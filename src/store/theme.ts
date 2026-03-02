import { persistentAtom } from "@nanostores/persistent";

type Theme = "light" | "dark";

export const theme = persistentAtom<Theme>("site-theme", "light");

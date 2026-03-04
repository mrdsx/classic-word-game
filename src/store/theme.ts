import { persistentAtom } from "@nanostores/persistent";

type ThemeState = "light" | "dark";

export const theme = persistentAtom<ThemeState>("siteTheme", "light");

export const FRONTEND_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:3000"
    : "https://classic-word-game.netlify.app";

export const MIN_WORD_LENGTH = 2;
export const MAX_WORD_LENGTH = 30;

export const DICTIONARY_API_URL =
  "https://api.dictionaryapi.dev/api/v2/entries/en";

import type { Word } from "$features/word-game/types";

export type SinglePlayerWordGame = {
  mistakes: number;
  maxMistakes: number;
  words: Word[];
};

export type SinglePlayerWordGamePreferences = {
  maxMistakes: number;
};

import { MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "$lib/constants";
import { isLowercaseOnly } from "$lib/utils";
import { persistentAtom } from "@nanostores/persistent";

export const persistentWords = persistentAtom<string[]>("words", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function addWord(newWord: string): void {
  newWord = newWord.trim().toLowerCase();

  if (newWord.length < MIN_WORD_LENGTH) {
    throw new Error("Too short");
  }
  if (newWord.length > MAX_WORD_LENGTH) {
    throw new Error("Too long");
  }

  const lastWord = persistentWords.get()[0] ?? newWord[0];
  const lastWordLastChar = lastWord[lastWord.length - 1];
  const newWordFirstChar = newWord[0];

  if (lastWordLastChar !== newWordFirstChar) {
    throw new Error(`Word must start with "${lastWordLastChar}"`);
  }

  // non-alphabet symbols won't pass
  if (!isLowercaseOnly(newWord)) {
    throw new Error("Only alphabet letters allowed");
  }
  if (persistentWords.get().includes(newWord)) {
    throw new Error("Word already exists");
  }

  persistentWords.set([newWord, ...persistentWords.get()]);
}

export function resetWords(): void {
  persistentWords.set([]);
}

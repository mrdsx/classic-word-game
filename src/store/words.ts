import { normalizeWord, validateWord, validateWordResponse } from "$lib/utils";
import { persistentAtom } from "@nanostores/persistent";

type WordsState = string[];

export const words = persistentAtom<WordsState>("words", [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export async function addWord(
  newWord: string,
  assertWordExists: (word: string) => unknown,
): Promise<void> {
  newWord = normalizeWord(newWord);
  validateWord(newWord, words.get());

  const wordResponse = await assertWordExists(newWord);
  validateWordResponse(wordResponse);

  words.set([...words.get(), newWord]);
}

export function resetWords(): void {
  words.set([]);
}

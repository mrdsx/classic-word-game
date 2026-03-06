import { dictionaryWordSchema } from "./schemas";

export function validateDictionaryWord(data: unknown): void {
  const { data: words, success } = dictionaryWordSchema.safeParse(data);
  if (!success) {
    throw new Error("Invalid response shape.");
  }

  let isNoun = false;
  for (const word of words) {
    for (const meaning of word.meanings) {
      if (meaning.partOfSpeech === "noun") {
        isNoun = true;
      }
    }
  }

  if (!isNoun) {
    throw new Error("Word is not noun.");
  }
}

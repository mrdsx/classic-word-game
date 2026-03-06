import { isLowercaseOnly } from "$lib/utils";
import { WordGameError } from "./exceptions";

export function normalizeWord(word: string): string {
  return word.toLowerCase().trim();
}

export function validateWord(word: string, words: string[]): void {
  // assert easter eggs
  if (word === "mrdsx") {
    throw new Error("yo, wassup?");
  } else if (word === "69") {
    throw new Error("bro -_-");
  }

  // assert main rule of word game
  // (new word must start with last letter of last word)
  const lastWord = words[words.length - 1] ?? word[0];
  const lastWordLastChar = lastWord[lastWord.length - 1];
  const newWordFirstChar = word[0];

  if (lastWordLastChar !== newWordFirstChar) {
    throw new WordGameError(`Word must start with "${lastWordLastChar}".`);
  }
  if (words.includes(word)) {
    throw new WordGameError("Word already exists.");
  }

  // non-alphabet symbols won't pass
  if (!isLowercaseOnly(word)) {
    throw new Error("Only alphabet letters allowed.");
  }
}

<script lang="ts">
  import { localWordGameQueryKeys } from "$features/local-word-game/queryKeys";
  import {
    MAX_WORD_LENGTH,
    MIN_WORD_LENGTH,
  } from "$features/word-game/constants";
  import type { Word } from "$features/word-game/types";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { LoadingSwap } from "$lib/components/ui/loading-swap";
  import { declineWord } from "$lib/utils";
  import { createMutation } from "@tanstack/svelte-query";
  import {
    incrementMistakes,
    resetMistakes,
  } from "../../../store/localWordGame";
  import { addWord, resetWords, words } from "../../../store/words";

  let canAddWords: boolean = $state(true);
  let input: HTMLInputElement | null = $state(null);
  let inputError: string | null = $state(null);

  const addWordMutation = createMutation(() => ({
    mutationKey: localWordGameQueryKeys.addWord,
    mutationFn: async (word: Word) => {
      return await addWord(word);
    },
  }));

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    inputError = null;
    if (input === null || !canAddWords) return;

    try {
      const newWord = input.value;
      await addWordMutation.mutateAsync(newWord);
      input.value = "";
      resetMistakes();
    } catch (error) {
      if (error instanceof Error) {
        inputError = error.message;
        incrementMistakes(handleGameOver);
        return;
      }

      throw error;
    }
  }

  function handleGameOver(): void {
    const enteredWords = words.get().length;
    inputError = `Game over. Your result is ${enteredWords} ${declineWord(enteredWords, ["word", "words"])}.`;
    resetWords();
  }
</script>

<form class="flex w-full gap-2" onsubmit={handleSubmit}>
  <div class="w-full space-y-0.5">
    <Input
      placeholder="Enter the word"
      minlength={MIN_WORD_LENGTH}
      maxlength={MAX_WORD_LENGTH}
      aria-invalid={inputError !== null}
      disabled={!canAddWords}
      bind:ref={input}
    />
    {#if inputError !== null}
      <p class="text-destructive text-sm">{inputError}</p>
    {/if}
  </div>
  <Button
    class="w-25"
    type="submit"
    disabled={addWordMutation.isPending || !canAddWords}
  >
    <LoadingSwap isLoading={addWordMutation.isPending} fallback="Adding">
      Add
    </LoadingSwap>
  </Button>
</form>

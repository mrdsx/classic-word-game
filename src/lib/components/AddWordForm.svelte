<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { MAX_WORD_LENGTH } from "$lib/constants";
  import { declineWord } from "$lib/utils";
  import { createMutation } from "@tanstack/svelte-query";
  import { assertWordExists } from "../../api/word";
  import {
    incrementWrongAttempts,
    resetWrongAttempts,
  } from "../../store/localWordGame";
  import { addWord, resetWords, words } from "../../store/words";
  import { LoadingSwap } from "./ui/loading-swap";

  let canAddWords: boolean = $state(true);
  let input: HTMLInputElement | null = $state(null);
  let inputError: string | null = $state(null);

  const wordExists = createMutation(() => ({
    mutationFn: async (word: string) => {
      return await assertWordExists(word);
    },
    onMutate: () => {
      inputError = null;
    },
  }));

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    if (input === null || !canAddWords) return;

    try {
      const newWord = input.value;
      await addWord(newWord, wordExists.mutateAsync);
      input.value = "";
      resetWrongAttempts();
    } catch (error) {
      if (error instanceof Error) {
        inputError = error.message;
        incrementWrongAttempts(handleGameOver);
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
    disabled={wordExists.isPending || !canAddWords}
  >
    <LoadingSwap isLoading={wordExists.isPending} fallback="Adding">
      Add
    </LoadingSwap>
  </Button>
</form>

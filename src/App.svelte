<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { Input } from "$lib/components/ui/input";
  import { MAX_WORD_LENGTH } from "$lib/constants";
  import { onMount } from "svelte";
  import { addWord, persistentWords, resetWords } from "./store/words";

  let input: HTMLInputElement | null = $state(null);
  let inputError = $state({
    isError: false,
    message: "",
  });
  let words: string[] = $state([]);

  onMount(() => {
    const unsubscribe = persistentWords.subscribe((newWords) => {
      words = newWords as string[];
    });

    return () => unsubscribe();
  });

  function handleSubmit(event: Event): void {
    inputError.isError = false;
    inputError.message = "";
    event.preventDefault();
    if (input === null) return;

    try {
      const newWord = input.value;
      addWord(newWord);
      input.value = "";
    } catch (error) {
      if (error instanceof Error) {
        inputError.isError = true;
        inputError.message = error.message;
        return;
      }

      throw error;
    }
  }
</script>

<div class="flex flex-col items-center gap-4 px-5 pt-20">
  <h1 class="text-2xl font-semibold">Word Game</h1>
  <div class="flex w-full max-w-100 flex-col items-center gap-2">
    <form class="flex w-full gap-2" onsubmit={handleSubmit}>
      <div class="w-full space-y-0.5">
        <Input
          placeholder="Enter the word"
          maxlength={MAX_WORD_LENGTH}
          aria-invalid={inputError.isError}
          bind:ref={input}
        />
        {#if inputError.isError}
          <p class="text-destructive text-sm">{inputError.message}</p>
        {/if}
      </div>
      <Button class="w-20" type="submit">Add</Button>
    </form>
    <ul class="max-h-100 w-full space-y-2 overflow-auto">
      {#each words as word}
        <li class="rounded-md bg-blue-100 px-2 py-1 break-all">
          {word}
        </li>
      {/each}
    </ul>
    {#if words.length > 0}
      <Button variant="outline" onclick={resetWords}>Reset</Button>
    {/if}
  </div>
</div>

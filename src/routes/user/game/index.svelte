<script lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "$lib/components/ui/alert-dialog";
  import { Button, buttonVariants } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import LoadingSwap from "$lib/components/ui/loading-swap/loading-swap.svelte";
  import { Spinner } from "$lib/components/ui/spinner";
  import { MAX_WORD_LENGTH, MIN_WORD_LENGTH } from "$lib/constants";
  import { db } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import type { SinglePlayerWordGame } from "$lib/types";
  import { declineWord, normalizeWord, validateWord } from "$lib/utils";
  import { createMutation } from "@tanstack/svelte-query";
  import type { Unsubscribe } from "firebase/auth";
  import { doc, onSnapshot, setDoc } from "firebase/firestore";
  import { onDestroy } from "svelte";
  import { assertWordExists } from "../../../api/word";
  import { userState } from "../../../store/userState";

  let unsubscribe: Unsubscribe | null = $state(null);
  let wordGame: SinglePlayerWordGame | null | undefined = $state(undefined);
  let newWord: string = $state("");
  let submitError: string | null = $state(null);

  const userUID = $derived($userState.currentUser?.uid);
  const words = $derived((wordGame ?? { words: [] }).words as string[]);
  const reversedWords = $derived([...words].reverse());

  const wordExists = createMutation(() => ({
    mutationFn: async (word: string) => {
      return await assertWordExists(word);
    },
  }));

  const updateWordGame = createMutation(() => ({
    mutationKey: ["updateWordGame"],
    mutationFn: async ({
      newWord,
      userUID,
      wordGame,
    }: {
      newWord: string;
      userUID: string;
      wordGame: SinglePlayerWordGame;
    }) => {
      const word = normalizeWord(newWord);
      validateWord(word, wordGame.words);
      await wordExists.mutateAsync(word);

      const newWordGame: Partial<SinglePlayerWordGame> = {
        mistakes: 0,
        words: [...wordGame.words, word],
      };
      await setDoc(doc(db, "singlePlayerWordGames", userUID), newWordGame, {
        merge: true,
      });
    },
  }));

  const incrementMistakes = createMutation(() => ({
    mutationKey: ["incrementMistakes"],
    mutationFn: async ({
      userUID,
      wordGame,
    }: {
      userUID: string;
      wordGame: SinglePlayerWordGame;
    }) => {
      await setDoc(
        doc(db, "singlePlayerWordGames", userUID),
        { mistakes: wordGame.mistakes + 1 },
        { merge: true },
      );
    },
  }));

  $effect(() => {
    if (userUID === undefined) return;

    unsubscribe = onSnapshot(
      doc(db, "singlePlayerWordGames", userUID),
      async (doc) => {
        const wordGameData = doc.data() as SinglePlayerWordGame;
        if (wordGameData.mistakes >= wordGameData.maxMistakes) {
          await handleGameOver(wordGameData.words.length, userUID);
        } else {
          wordGame = wordGameData ?? null;
        }
      },
      () => {
        wordGame = null;
      },
    );
  });

  onDestroy(() => {
    unsubscribe?.();
  });

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    submitError = null;
    if (userUID === undefined || wordGame === undefined || wordGame === null)
      return;

    const wordGameSnapshot = $state.snapshot(wordGame);
    try {
      await updateWordGame.mutateAsync({
        newWord,
        userUID,
        wordGame: wordGameSnapshot,
      });
      newWord = "";
    } catch (error) {
      incrementMistakes.mutate({
        userUID,
        wordGame: wordGameSnapshot,
      });
      if (error instanceof Error) {
        submitError = error.message;
        return;
      }
      throw error;
    }
  }

  async function handleGameOver(
    userScore: number,
    userUID: string,
  ): Promise<void> {
    submitError = `Game over. Your result is ${userScore} ${declineWord(userScore, ["word", "words"])}.`;
    await setDoc(
      doc(db, "singlePlayerWordGames", userUID),
      { mistakes: 0, words: [] },
      { merge: true },
    );
  }

  async function handleWordsReset(userUID: string | undefined): Promise<void> {
    if (userUID === undefined) return;

    await setDoc(
      doc(db, "singlePlayerWordGames", userUID),
      { mistakes: 0, words: [] },
      { merge: true },
    );
  }
</script>

<div class="flex w-full max-w-100 flex-col items-center gap-4 px-5">
  <h1 class="pt-10 text-2xl font-semibold">Word Game</h1>
  <form class="flex w-full gap-2" onsubmit={handleSubmit}>
    <div class="w-full space-y-0.5">
      <Input
        placeholder="Enter the word"
        minlength={MIN_WORD_LENGTH}
        maxlength={MAX_WORD_LENGTH}
        disabled={wordGame === undefined}
        aria-invalid={submitError !== null}
        bind:value={newWord}
      />
      {#if submitError !== null}
        <p class="text-destructive text-sm">{submitError}</p>
      {/if}
    </div>

    <Button
      class="w-25"
      type="submit"
      disabled={wordGame === undefined || updateWordGame.isPending}
    >
      <LoadingSwap isLoading={updateWordGame.isPending} fallback="Adding">
        Add
      </LoadingSwap>
    </Button>
  </form>
  <div class="flex w-full flex-col items-center gap-2">
    {#if wordGame === undefined}
      <Spinner class="size-5" />
    {:else if wordGame === null}
      <p class="text-destructive">Failed to load words.</p>
    {:else if wordGame.words.length > 0}
      <div class="flex w-full justify-between text-sm font-semibold">
        <p>
          Words: {wordGame.words.length}
        </p>
        <p class="text-destructive">
          Mistakes: {wordGame?.mistakes}/{wordGame?.maxMistakes}
        </p>
      </div>
      <ul class="max-h-80 w-full space-y-2 overflow-auto">
        {#each reversedWords as word (word)}
          <li
            class="dark:text-background rounded-md bg-blue-100 px-2 py-1 break-all dark:bg-blue-400/80"
          >
            {word}
          </li>
        {/each}
      </ul>
    {/if}
    <div class="space-x-1">
      {#if wordGame !== undefined && wordGame !== null && wordGame.words.length > 0}
        <AlertDialog>
          <AlertDialogTrigger class={buttonVariants({ variant: "outline" })}>
            Reset
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                All entered words will be deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>No</AlertDialogCancel>
              <AlertDialogAction onclick={() => handleWordsReset(userUID)}
                >Yes</AlertDialogAction
              >
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      {/if}

      <Button onclick={() => navigate("/")}>Finish</Button>
    </div>
  </div>
</div>

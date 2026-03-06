<script lang="ts">
  import { authState } from "$features/auth/stores/authState";
  import { wordGameQueryKeys } from "$features/single-player-word-game/queryKeys";
  import type {
    SinglePlayerWordGame,
    SinglePlayerWordGamePreferences,
  } from "$features/single-player-word-game/types";
  import { db } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { createMutation, createQuery } from "@tanstack/svelte-query";
  import { doc, DocumentSnapshot, getDoc, setDoc } from "firebase/firestore";
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
  } from "../../../lib/components/ui/alert-dialog";
  import { Button, buttonVariants } from "../../../lib/components/ui/button";
  import { Label } from "../../../lib/components/ui/label";
  import { LoadingSwap } from "../../../lib/components/ui/loading-swap";
  import {
    NativeSelect,
    NativeSelectOption,
  } from "../../../lib/components/ui/native-select";
  import { Skeleton } from "../../../lib/components/ui/skeleton";

  // TODO: refactor

  const NEW_GAME_BUTTON_TEXT = "New game";

  let maxMistakesSelectRef: HTMLSelectElement | null = $state(null);
  const userUID = $derived($authState.currentUser?.uid);

  const wordGame = createQuery(() => ({
    queryKey: wordGameQueryKeys.singlePlayer,
    queryFn: async () => {
      const userUID = authState.get().currentUser?.uid ?? "";
      const singlePlayerWordGameDoc = doc(db, "singlePlayerWordGames", userUID);

      const docSnapshot = (await getDoc(
        singlePlayerWordGameDoc,
      )) as DocumentSnapshot<SinglePlayerWordGame>;
      return docSnapshot.data() ?? null;
    },
    enabled: $authState.currentUser !== null,
  }));

  const wordGamePreferences = createQuery(() => ({
    queryKey: wordGameQueryKeys.preferences,
    queryFn: async () => {
      const userUID = authState.get().currentUser?.uid ?? "";
      const singlePlayerWordGamePreferencesDoc = doc(
        db,
        "singlePlayerWordGamePreferences",
        userUID,
      );

      const docSnapshot = (await getDoc(
        singlePlayerWordGamePreferencesDoc,
      )) as DocumentSnapshot<SinglePlayerWordGamePreferences>;
      return docSnapshot.exists()
        ? (docSnapshot.data() as SinglePlayerWordGamePreferences)
        : null;
    },
    enabled: $authState.currentUser !== null,
  }));

  const startNewGameMutation = createMutation(() => ({
    mutationKey: wordGameQueryKeys.startWordGame,
    mutationFn: async ({
      maxMistakes,
      userUID,
    }: {
      maxMistakes: number;
      userUID: string;
    }) => {
      const newWordGame: SinglePlayerWordGame = {
        maxMistakes,
        mistakes: 0,
        words: [],
      };

      await setDoc(doc(db, "singlePlayerWordGames", userUID), newWordGame, {
        merge: true,
      });
      await navigate("/user/game");
    },
  }));

  const maxMistakes = $derived(wordGamePreferences.data?.maxMistakes ?? 5);
  const canContinueGame = $derived(
    wordGame.data !== undefined &&
      wordGame.data !== null &&
      wordGame.data.words.length > 0,
  );

  $effect(() => {
    if (maxMistakesSelectRef !== null) {
      maxMistakesSelectRef.value = String(maxMistakes);
    }
  });

  async function handleUpdateMaxMistakes(
    event: Event & {
      currentTarget: EventTarget & HTMLSelectElement;
    },
  ): Promise<void> {
    if (userUID === undefined) return;

    const maxMistakes = Number(event.currentTarget.value);
    if (isNaN(maxMistakes)) return;

    await setDoc(
      doc(db, "singlePlayerWordGamePreferences", userUID),
      { maxMistakes },
      { merge: true },
    );
  }

  async function handleStartNewGame(): Promise<void> {
    if (userUID === undefined || maxMistakesSelectRef === null) return;

    const maxMistakes = Number(maxMistakesSelectRef.value);
    if (isNaN(maxMistakes)) return;

    startNewGameMutation.mutate({ maxMistakes, userUID });
  }
</script>

<form class="card flex w-full flex-col items-center gap-4">
  <div class="flex w-full justify-between space-y-2">
    <Label>Max consecutive mistakes</Label>
    {#if wordGamePreferences.isPending}
      <Skeleton class="h-9 w-14.5" />
    {:else}
      <NativeSelect
        value={maxMistakes}
        disabled={wordGamePreferences.isPending}
        onchange={handleUpdateMaxMistakes}
        bind:ref={maxMistakesSelectRef}
      >
        <NativeSelectOption value="1">1</NativeSelectOption>
        <NativeSelectOption value="2">2</NativeSelectOption>
        <NativeSelectOption value="3">3</NativeSelectOption>
        <NativeSelectOption value="4">4</NativeSelectOption>
        <NativeSelectOption value="5">5</NativeSelectOption>
      </NativeSelect>
    {/if}
  </div>
  <div class="flex gap-2 *:w-25">
    {#if wordGame.isPending}
      <Skeleton class="h-9" />
    {:else}
      <Button
        variant="outline"
        disabled={!canContinueGame || wordGame.isPending}
        onclick={() => navigate("/user/game")}
      >
        Continue
      </Button>
    {/if}
    {#if wordGame.isPending}
      <Skeleton class="h-9" />
    {:else if canContinueGame}
      <AlertDialog>
        <AlertDialogTrigger
          class={buttonVariants({ variant: "default" })}
          type="button"
          disabled={!canContinueGame || wordGame.isPending}
        >
          {NEW_GAME_BUTTON_TEXT}
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              You still have game in progress. It'll be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No</AlertDialogCancel>
            <AlertDialogAction
              disabled={startNewGameMutation.isPending}
              onclick={handleStartNewGame}
            >
              <LoadingSwap isLoading={startNewGameMutation.isPending}>
                Yes
              </LoadingSwap>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    {:else}
      <Button
        disabled={wordGame.isPending || startNewGameMutation.isPending}
        onclick={handleStartNewGame}
      >
        <LoadingSwap isLoading={startNewGameMutation.isPending}>
          {NEW_GAME_BUTTON_TEXT}
        </LoadingSwap>
      </Button>
    {/if}
  </div>
</form>

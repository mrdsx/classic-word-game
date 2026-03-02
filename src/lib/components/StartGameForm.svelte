<script lang="ts" module>
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
  import { Label } from "$lib/components/ui/label";
  import { startNewWordGame, startWordGame } from "../../store/gameState";
  import { words } from "../../store/words";
  import MaxAttemptsNativeSelect from "./MaxAttemptsNativeSelect.svelte";
  import { Button, buttonVariants } from "./ui/button";

  const NEW_GAME_BUTTON_TEXT = "New game";
</script>

<script lang="ts">
  let canContinueGame = $state(words.get().length > 0);

  function handleSubmit(): void {
    startNewWordGame();
  }

  function continueGame(): void {
    startWordGame();
  }
</script>

<form
  class="card flex w-full flex-col items-center gap-4"
  onsubmit={handleSubmit}
>
  <div class="flex w-full justify-between space-y-2">
    <Label>Max consecutive wrong attempts</Label>
    <MaxAttemptsNativeSelect />
  </div>
  <div class="flex gap-2 *:w-25">
    <Button
      variant="outline"
      onclick={continueGame}
      disabled={!canContinueGame}
    >
      Continue
    </Button>
    {#if canContinueGame}
      <AlertDialog>
        <AlertDialogTrigger
          class={buttonVariants({ variant: "default" })}
          type="button"
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
            <AlertDialogAction onclick={startNewWordGame}>
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    {:else}
      <Button type="submit">{NEW_GAME_BUTTON_TEXT}</Button>
    {/if}
  </div>
</form>

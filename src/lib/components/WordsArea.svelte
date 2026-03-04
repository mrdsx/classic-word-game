<script lang="ts">
  import {
    localWordGame,
    resetWordGame,
    stopWordGame,
  } from "../../store/localWordGame";
  import { localWordGamePreferences } from "../../store/localWordGamePreferences";
  import { words } from "../../store/words";
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
  } from "./ui/alert-dialog";
  import { Button, buttonVariants } from "./ui/button";

  const reversedWords = $derived([...$words].reverse());
</script>

<div class="flex w-full flex-col items-center gap-2">
  {#if $words.length > 0}
    <div class="flex w-full justify-between text-sm font-semibold">
      <p>
        Words: {$words.length}
      </p>
      <p class="text-destructive">
        Mistakes: {$localWordGame.mistakes}/{$localWordGamePreferences.currentMaxMistakes}
      </p>
    </div>
  {/if}
  <ul class="max-h-80 w-full space-y-2 overflow-auto">
    {#each reversedWords as word (word)}
      <li
        class="dark:text-background rounded-md bg-blue-100 px-2 py-1 break-all dark:bg-blue-400/80"
      >
        {word}
      </li>
    {/each}
  </ul>
  <div class="space-x-1">
    {#if $words.length > 0}
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
            <AlertDialogAction onclick={resetWordGame}>Yes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    {/if}

    <Button onclick={stopWordGame}>Finish</Button>
  </div>
</div>

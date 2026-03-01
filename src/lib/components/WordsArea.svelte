<script lang="ts">
  import { gamePreferences } from "../../store/gamePreferences";
  import { gameState } from "../../store/gameState";
  import { resetWords, words } from "../../store/words";
  import FinishGameAlertDialog from "./FinishGameAlertDialog.svelte";
  import { Button } from "./ui/button";
</script>

<ul class="max-h-90 w-full space-y-2 overflow-auto">
  {#each $words as word (word)}
    <li class="rounded-md bg-blue-100 px-2 py-1 break-all">
      {word}
    </li>
  {/each}
</ul>
{#if $words.length > 0}
  <div class="flex w-full justify-between text-sm font-semibold">
    <p>
      Words: {$words.length}
    </p>
    <p class="text-destructive">
      Mistakes: {$gameState.wrongAttempts}/{$gamePreferences.maxWrongAttempts}
    </p>
  </div>
{/if}
<div>
  {#if $words.length > 0}
    <Button variant="outline" onclick={resetWords}>Reset</Button>
  {/if}
  <FinishGameAlertDialog />
</div>

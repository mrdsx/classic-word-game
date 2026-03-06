<script lang="ts">
  import { words } from "$features/local-word-game/stores";
  import { localWordGame } from "../../../store/localWordGame";
  import { localWordGamePreferences } from "../../../store/localWordGamePreferences";
</script>

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

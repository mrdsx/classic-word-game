<script lang="ts">
  import { gameState } from "../store/gameState";
  import AddWordForm from "$lib/components/AddWordForm.svelte";
  import WordsArea from "$lib/components/WordsArea.svelte";
  import StartGameForm from "$lib/components/StartGameForm.svelte";
</script>

<h1 class="pt-10 text-2xl font-semibold">Word Game</h1>
<div class="flex w-full max-w-100 flex-col items-center gap-4 px-5">
  {#if $gameState.isPlaying}
    <AddWordForm />
    <WordsArea />
  {:else}
    <StartGameForm />
  {/if}
</div>

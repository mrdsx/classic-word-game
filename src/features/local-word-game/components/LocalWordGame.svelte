<script>
  import { WordsArea } from "$features/local-word-game/components";
  import { localWordGame } from "../../../store/localWordGame";
  import AddWordForm from "./AddWordForm.svelte";
  import StartGameForm from "./StartGameForm.svelte";
</script>

{#if $localWordGame.isPlaying}
  <AddWordForm />
  <WordsArea />
{:else}
  <StartGameForm />
{/if}

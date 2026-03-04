<script>
  import { localWordGame } from "../../store/localWordGame";
  import AddWordForm from "./AddWordForm.svelte";
  import StartGameForm from "./StartGameForm.svelte";
  import WordsArea from "./WordsArea.svelte";
</script>

{#if $localWordGame.isPlaying}
  <AddWordForm />
  <WordsArea />
{:else}
  <StartGameForm />
{/if}

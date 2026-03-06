<script lang="ts">
  import { words } from "$features/local-word-game/stores";
  import { WordsList } from "$features/word-game/components";
  import LocalWordGameActions from "./LocalWordGameActions.svelte";
  import LocalWordGameInfo from "./LocalWordGameInfo.svelte";

  const reversedWords = $derived([...$words].reverse());
</script>

<div class="flex w-full flex-col items-center gap-2">
  <LocalWordGameInfo />
  <WordsList words={reversedWords} />
  <LocalWordGameActions />
</div>

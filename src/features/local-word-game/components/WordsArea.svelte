<script lang="ts">
  import { WordsList } from "$features/word-game/components";
  import { words } from "../../../store/words";
  import LocalWordGameActions from "./LocalWordGameActions.svelte";
  import LocalWordGameInfo from "./LocalWordGameInfo.svelte";

  const reversedWords = $derived([...$words].reverse());
</script>

<div class="flex w-full flex-col items-center gap-2">
  <LocalWordGameInfo />
  <WordsList words={reversedWords} />
  <LocalWordGameActions />
</div>

<script lang="ts">
  import type { Word } from "../types";

  type WordsListProps = {
    words: Word[];
  };

  let { words }: WordsListProps = $props();
</script>

<ul class="max-h-80 w-full space-y-2 overflow-auto">
  {#each words as word (word)}
    <li
      class="dark:text-background rounded-md bg-blue-100 px-2 py-1 break-all dark:bg-blue-400/80"
    >
      {word}
    </li>
  {/each}
</ul>

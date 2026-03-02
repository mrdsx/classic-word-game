<script lang="ts">
  import AddWordForm from "$lib/components/AddWordForm.svelte";
  import StartGameForm from "$lib/components/StartGameForm.svelte";
  import ToggleThemeButton from "$lib/components/ToggleThemeButton.svelte";
  import { Button } from "$lib/components/ui/button";
  import WordsArea from "$lib/components/WordsArea.svelte";
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { gameState } from "./store/gameState";
  import { theme } from "./store/theme";

  const queryClient = new QueryClient();

  $effect(() => {
    if ($theme === "dark") {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  });
</script>

<QueryClientProvider client={queryClient}>
  <div class="flex flex-col items-center gap-4">
    <header class="flex w-full justify-end space-x-2 p-3">
      <ToggleThemeButton />
      <Button variant="outline">Log In</Button>
    </header>
    <h1 class="pt-10 text-2xl font-semibold">Word Game</h1>
    <div class="flex w-full max-w-100 flex-col items-center gap-4 px-5">
      {#if $gameState.isPlaying}
        <AddWordForm />
        <WordsArea />
      {:else}
        <StartGameForm />
      {/if}
    </div>
  </div>
</QueryClientProvider>

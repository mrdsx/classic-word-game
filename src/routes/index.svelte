<script lang="ts">
  import LocalWordGame from "$lib/components/LocalWordGame.svelte";
  import RemoteWordGame from "$lib/components/RemoteWordGame.svelte";
  import { userState } from "../store/userState";
</script>

<h1 class="pt-10 text-2xl font-semibold">Word Game</h1>
<div
  class="bg-white-100 flex w-full max-w-100 flex-col items-center gap-4 px-5"
>
  {#if $userState.currentUser === null}
    <LocalWordGame />
  {:else}
    <RemoteWordGame />
  {/if}
</div>

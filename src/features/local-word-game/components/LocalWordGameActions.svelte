<script lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "../../../lib/components/ui/alert-dialog";
  import { Button, buttonVariants } from "../../../lib/components/ui/button";
  import { resetWordGame, stopWordGame } from "../../../store/localWordGame";
  import { words } from "../../../store/words";
</script>

<div class="space-x-1">
  {#if $words.length > 0}
    <AlertDialog>
      <AlertDialogTrigger class={buttonVariants({ variant: "outline" })}>
        Reset
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            All entered words will be deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          <AlertDialogAction onclick={resetWordGame}>Yes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  {/if}

  <Button onclick={stopWordGame}>Finish</Button>
</div>

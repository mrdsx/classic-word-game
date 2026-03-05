<script lang="ts">
  import { Alert, AlertTitle } from "$lib/components/ui/alert";
  import { navigate } from "$lib/router";
  import { CircleCheckIcon } from "lucide-svelte";
  import { userState } from "../../../store/userState";

  $effect(() => {
    if ($userState.currentUser !== null) {
      navigate("/");
    }
  });
</script>

<div class="flex flex-col items-center gap-2 pt-20">
  <h1 class="mb-4 text-lg font-semibold">Verify your email</h1>
  <Alert variant="success">
    <CircleCheckIcon />
    <AlertTitle>Verification link has been sent to your email.</AlertTitle>
  </Alert>
</div>

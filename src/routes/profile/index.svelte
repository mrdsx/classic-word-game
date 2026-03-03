<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { updateProfile } from "firebase/auth";
  import { userState } from "../../store/userState";

  let nickname = $state("");

  async function handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    const user = userState.get().currentUser;
    if (user === null) return;

    await updateProfile(user, { displayName: nickname });
  }
</script>

<h1 class="mb-4 text-xl font-semibold">Profile Settings</h1>
<form class="w-full max-w-100 space-y-4" onsubmit={handleSubmit}>
  <fieldset class="space-y-1.5">
    <Label for="display-name">Nickname</Label>
    <Input
      id="display-name"
      placeholder="Enter your nickname"
      bind:value={nickname}
    />
  </fieldset>
  <Button type="submit">Save</Button>
</form>

<script lang="ts">
  import {
    AuthForm,
    AuthFormAction,
    AuthFormFieldset,
    AuthFormFooter,
    AuthFormTitle,
  } from "$features/auth/components";
  import { authQueryKeys } from "$features/auth/queryKeys";
  import { emailSchema, loginPasswordSchema } from "$features/auth/schemas";
  import { authState } from "$features/auth/stores/authState";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { auth } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { createMutation } from "@tanstack/svelte-query";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { toast } from "svelte-sonner";

  let email = $state("");
  let password = $state("");
  let emailError: string | null = $state(null);
  let passwordError: string | null = $state(null);

  const userLogin = createMutation(() => ({
    mutationKey: authQueryKeys.login,
    mutationFn: async () => {
      await signInWithEmailAndPassword(auth, email, password);
    },
    onError: () => {
      toast.error("Wrong email or password.");
    },
  }));

  $effect(() => {
    if ($authState.currentUser !== null) {
      navigate("/");
    }
  });

  function handleSubmit(event: Event): void {
    event.preventDefault();
    emailError = null;
    passwordError = null;

    const emailParse = emailSchema.safeParse(email);
    const passwordParse = loginPasswordSchema.safeParse(password);
    if (!emailParse.success) {
      emailError = "Invalid email.";
    }
    if (!passwordParse.success) {
      passwordError = "Invalid password.";
    }

    if (emailError === null && passwordError === null) {
      userLogin.mutate();
    }
  }
</script>

<AuthForm onsubmit={handleSubmit}>
  <AuthFormTitle>Login to your account</AuthFormTitle>
  <AuthFormFieldset>
    <Label for="email">Email</Label>
    <Input
      id="email"
      placeholder="Enter your email"
      aria-invalid={emailError !== null}
      bind:value={email}
    />
    {#if emailError !== null}
      <p class="text-destructive text-sm">{emailError}</p>
    {/if}
  </AuthFormFieldset>
  <AuthFormFieldset>
    <Label for="password">Password</Label>
    <Input
      id="password"
      type="password"
      placeholder="Enter your password"
      aria-invalid={passwordError !== null}
      bind:value={password}
    />
    {#if passwordError !== null}
      <p class="text-destructive text-sm">{passwordError}</p>
    {/if}
  </AuthFormFieldset>
  <AuthFormAction isLoading={userLogin.isPending}>Log In</AuthFormAction>
  <AuthFormFooter>
    Don't have account yet? Create new one <Button
      href="/register"
      variant="link"
    >
      here
    </Button>.
  </AuthFormFooter>
</AuthForm>

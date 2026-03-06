<script lang="ts">
  import {
    AuthForm,
    AuthFormAction,
    AuthFormFieldset,
    AuthFormFooter,
    AuthFormTitle,
  } from "$features/auth/components";
  import { authQueryKeys } from "$features/auth/queryKeys";
  import { emailSchema, registerPasswordSchema } from "$features/auth/schemas";
  import { Button } from "$lib/components/ui/button";
  import { Input } from "$lib/components/ui/input";
  import { Label } from "$lib/components/ui/label";
  import { auth, mapFirebaseErrorCode } from "$lib/firebase";
  import { navigate } from "$lib/router";
  import { createMutation } from "@tanstack/svelte-query";
  import {
    createUserWithEmailAndPassword,
    type AuthError,
  } from "firebase/auth";
  import { toast } from "svelte-sonner";

  let email = $state("");
  let password = $state("");
  let emailError: string | null = $state(null);
  let passwordError: string | null = $state(null);

  const userRegister = createMutation(() => ({
    mutationKey: authQueryKeys.register,
    mutationFn: async () => {
      return await createUserWithEmailAndPassword(auth, email, password);
    },
    onSuccess: () => {
      navigate("/register/verify");
    },
    onError: (error: AuthError) => {
      const firebaseError = mapFirebaseErrorCode(error.code);
      toast.error(firebaseError ?? "Failed to sign up.");
    },
  }));

  function handleSubmit(event: Event): void {
    event.preventDefault();
    emailError = null;
    passwordError = null;

    const emailParse = emailSchema.safeParse(email);
    const passwordParse = registerPasswordSchema.safeParse(password);
    if (!emailParse.success) {
      emailError = "Invalid email.";
    }
    if (!passwordParse.success) {
      passwordError = "Invalid password.";
    }

    if (emailError === null && passwordError === null) {
      userRegister.mutate();
    }
  }
</script>

<AuthForm onsubmit={handleSubmit}>
  <AuthFormTitle>Create new account</AuthFormTitle>
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
  <AuthFormAction isLoading={userRegister.isPending}>Sign Up</AuthFormAction>
  <AuthFormFooter>
    Already have an account? Log in <Button href="/login" variant="link">
      here
    </Button>.
  </AuthFormFooter>
</AuthForm>

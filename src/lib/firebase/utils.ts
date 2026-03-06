export function mapFirebaseErrorCode(str: string): string | undefined {
  switch (str) {
    case "auth/email-already-in-use":
      return "Email is already used.";
    default:
      return undefined;
  }
}

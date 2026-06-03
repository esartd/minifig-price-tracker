export function getFriendlyAuthError(errorParam?: string | null) {
  if (!errorParam) return null

  // NextAuth commonly uses ?error=...; your backend may also pass custom values.
  switch (errorParam) {
    case "OAuthAccountNotLinked":
      return "That Google account is not linked to an existing user. Try signing in with email instead."
    case "AccessDenied":
      return "Google sign-in was blocked. Please verify your Google account email and try again."
    case "Configuration":
      return "Authentication is not configured correctly. Please try again later."
    default:
      return "Sign-in failed. Please try again."
  }
}

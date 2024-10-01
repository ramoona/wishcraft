"use client";

export function SignInForm({ wishlistOwner, wishId }: { wishlistOwner?: string; wishId?: string }) {
  const queryParams = new URLSearchParams();

  if (wishlistOwner) {
    queryParams.append("wishlistOwner", wishlistOwner);
  }

  if (wishId) {
    queryParams.append("wishId", wishId);
  }

  return <a href={`/api/login/google?${queryParams.toString()}`}>{"Sign in with Google"}</a>;
}

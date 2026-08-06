type Props = {
  id?: string;
};

/**
 * Placeholder for Clerk bot protection (Turnstile). Must stay in the DOM before signUp.create().
 */
export function ClerkCaptcha({ id = "clerk-captcha" }: Props) {
  return (
    <div
      id={id}
      className="w-full min-h-0 empty:hidden [&:not(:empty)]:min-h-px"
      data-cl-theme="auto"
      data-cl-size="flexible"
    />
  );
}

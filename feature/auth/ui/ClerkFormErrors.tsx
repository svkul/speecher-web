type FieldError = {
  message?: string;
  longMessage?: string;
};

type ClerkErrorLike = {
  message?: string;
  longMessage?: string;
};

type Props = {
  fieldErrors?: Array<FieldError | null | undefined>;
  globalErrors?: ClerkErrorLike[] | null;
};

function pickMessage(error: FieldError | ClerkErrorLike | null | undefined) {
  if (!error) {
    return undefined;
  }

  return error.longMessage ?? error.message;
}

export function ClerkFormErrors({ fieldErrors = [], globalErrors }: Props) {
  const messages = [
    ...fieldErrors.map(pickMessage),
    ...(globalErrors?.map(pickMessage) ?? []),
  ].filter((message): message is string => Boolean(message));

  if (messages.length === 0) {
    return null;
  }

  return (
    <div
      role="alert"
      className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
    >
      {messages.map((message) => (
        <p key={message}>{message}</p>
      ))}
    </div>
  );
}

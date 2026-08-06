type Props = {
  message?: string;
};

export function FieldError({ message }: Props) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-destructive">{message}</p>;
}

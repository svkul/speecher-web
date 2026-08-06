import Link from "next/link";

type Props = {
  href: "/sign-in" | "/sign-up";
  label: string;
};

export function AuthSwitchLink({ href, label }: Props) {
  return (
    <p className="mt-2 text-center text-sm text-muted-foreground">
      <Link
        href={href}
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        {label}
      </Link>
    </p>
  );
}

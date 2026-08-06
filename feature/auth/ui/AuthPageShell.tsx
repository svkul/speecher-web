import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
};

export function AuthPageShell({ title, description, children, footer }: Props) {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center gap-6 px-4 py-10">
      <Link href="/" className="inline-flex items-center gap-2">
        <Image src="/assets/logo.svg" alt="Speecher" width={40} height={40} />
        <span className="text-lg font-semibold tracking-tight">Speecher</span>
      </Link>

      <div className="w-full space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="w-full">{children}</div>

      {footer}
    </main>
  );
}

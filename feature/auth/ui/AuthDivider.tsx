import { Separator } from "@/components/ui/separator";

type Props = {
  label: string;
};

export function AuthDivider({ label }: Props) {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <Separator />
      </div>

      <div className="relative flex justify-center text-xs">
        <span className="bg-background px-2 text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

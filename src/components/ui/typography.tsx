import { PropsWithChildren } from "react";
import { cn } from "~/utils/classnames";

export function TypographyExtraLargeHeader({ children }: PropsWithChildren) {
  return <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-5xl">{children}</h1>;
}

export function TypographyHeader({ children }: PropsWithChildren) {
  return <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">{children}</h1>;
}

export function TypographyH1({
  children,
  className,
  style,
}: PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <h1 className={cn("text-xl font-bold", className)} style={style}>
      {children}
    </h1>
  );
}

export function TypographyH2({
  children,
  style,
  className,
}: PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <h2 className={cn("text-3xl font-bold", className)} style={style}>
      {children}
    </h2>
  );
}

export function TypographyLeadBody({ children }: PropsWithChildren) {
  return <p className="leading-7">{children}</p>;
}

export function TypographyMuted({ children }: PropsWithChildren) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

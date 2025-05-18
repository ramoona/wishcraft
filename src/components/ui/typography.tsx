import { PropsWithChildren } from "react";

export function TypographyExtraLargeHeader({ children }: PropsWithChildren) {
  return <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight lg:text-5xl">{children}</h1>;
}

export function TypographyHeader({ children }: PropsWithChildren) {
  return <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">{children}</h1>;
}

export function TypographyH1({ children }: PropsWithChildren) {
  return <h1 className="text-xl font-bold">{children}</h1>;
}

export function TypographyH2({ children }: PropsWithChildren) {
  return <h1 className="text-lg font-bold">{children}</h1>;
}

export function TypographyLeadBody({ children }: PropsWithChildren) {
  return <p className="leading-7">{children}</p>;
}

export function TypographyMuted({ children }: PropsWithChildren) {
  return <p className="text-sm text-muted-foreground">{children}</p>;
}

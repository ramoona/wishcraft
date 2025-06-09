export function DesktopOnly({ children }: { children: React.ReactNode }) {
  return <div className="hidden lg:block">{children}</div>;
}

export function MobileOnly({ children }: { children: React.ReactNode }) {
  return <div className="block lg:hidden">{children}</div>;
}

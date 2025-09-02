import { User } from "~/services/user/types";
import { useEffect, useRef, useState } from "react";

export function useCopyProfileLink({ user }: { user: User }) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<number | null>(null);

  const link = `https://mywishcraft.app/${user.username}`;

  const copyLink = async () => {
    if (typeof window !== "undefined") {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      timeout.current = setTimeout(() => {
        setCopied(false);
      }, 3000) as unknown as number;
    }
  };

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return { copied, copyLink };
}

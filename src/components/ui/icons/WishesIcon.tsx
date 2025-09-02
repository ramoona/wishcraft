import * as React from "react";

export function WishesIcon({ isSelected }: { isSelected?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="size-5">
      <path
        className={isSelected ? "fill-black" : "fill-active"}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.465 1.161a1.517 1.517 0 0 1 2.945-.022c1.015 3.927 3.492 6.368 7.43 7.323a1.52 1.52 0 0 1 .02 2.95c-3.92 1.012-6.358 3.489-7.315 7.429a1.518 1.518 0 0 1-2.945.022c-1.015-3.927-3.492-6.368-7.43-7.323a1.52 1.52 0 0 1-.025-2.95C5.07 7.579 7.51 5.102 8.465 1.16Z"
      />
    </svg>
  );
}

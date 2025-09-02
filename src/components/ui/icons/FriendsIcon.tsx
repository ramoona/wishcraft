import * as React from "react";

export function FriendsIcon({ isSelected }: { isSelected?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="size-5">
      <path
        className={isSelected ? "fill-black" : "fill-active"}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.54 1.332a1.98 1.98 0 0 1 2.955.012 4.456 4.456 0 0 0 3.735 1.57 1.974 1.974 0 0 1 2.075 2.077 4.494 4.494 0 0 0 1.555 3.78 1.959 1.959 0 0 1-.015 2.926 4.41 4.41 0 0 0-1.56 3.726 1.971 1.971 0 0 1-2.1 2.07A4.368 4.368 0 0 0 11.48 19a1.986 1.986 0 0 1-2.96-.011 4.45 4.45 0 0 0-3.735-1.571 1.967 1.967 0 0 1-2.07-2.077 4.493 4.493 0 0 0-1.555-3.78 1.958 1.958 0 0 1 .015-2.926A4.408 4.408 0 0 0 2.73 4.911a1.971 1.971 0 0 1 2.1-2.07 4.372 4.372 0 0 0 3.71-1.51Z"
      />
    </svg>
  );
}

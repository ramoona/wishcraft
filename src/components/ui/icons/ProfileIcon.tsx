import * as React from "react";

export function ProfileIcon({ isSelected }: { isSelected?: boolean }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" className="size-5">
      <path
        className={isSelected ? "fill-black" : "fill-active"}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.38 18.455H.555A9.404 9.404 0 0 1 7.825 9.3a4.353 4.353 0 1 1 4.38.025 9.405 9.405 0 0 1 7.175 9.13Z"
      />
    </svg>
  );
}

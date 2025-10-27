"use client";

import { ButtonHTMLAttributes } from "react";

type PlaceholderButtonProps = {
  label: string;
  tooltip?: string;
  onClickPlaceholder?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "onClick">;

/**
 * 按钮占位符，未来根据不同按钮功能设定不同的onClick函数，目前无功能
 * @param param0
 * @returns
 */
export function PlaceholderButton({
  label,
  tooltip,
  onClickPlaceholder,
  ...buttonProps
}: PlaceholderButtonProps) {
  return (
    <button
      type="button"
      className="rounded-md border px-3 py-1.5 text-sm hover:bg-gray-50"
      title={tooltip}
      onClick={() => {
        console.info(`${label} placeholder clicked`);
        onClickPlaceholder?.();
      }}
      {...buttonProps}
    >
      {label}
    </button>
  );
}

export default PlaceholderButton;

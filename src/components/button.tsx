"use client";

import { IconType } from "react-icons";

interface ButtonProps {
  label: string;
  disabled?: boolean;
  outline?: boolean;
  small?: boolean;
  custom?: string;
  icon?: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}
const CustomeButton: React.FC<ButtonProps> = ({
  label,
  disabled,
  small,
  outline,
  onClick,
  icon: Icon,
  custom,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`disabled:opacity-70 disabled:cursor-not-allowed rounded-xl hover:opacity-80 transition w-full  flex items-center justify-center gap-2 ${
        outline ? `bg-white ` : `bg-teal `
      }${outline ? ` text-slate-700` : `bg-slate-700 text-white`} ${
        small
          ? `text-sm py-1 px-2 font-light border-[1px]`
          : `text-md py-3 px-4 font-semibold border-2`
      }${custom ? custom : ``}`}
    >
      {Icon && <Icon size={24} />}
      {label}
    </button>
  );
};
export default CustomeButton;

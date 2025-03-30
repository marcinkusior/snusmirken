import { ReactNode, useState } from "react";
import cx from "classnames";
import "./TaskbarButton.css";

interface TaskbarButtonProps {
  icon: ReactNode;
  text: string;
  onClick: () => void;
  isMinimized: boolean;
  initialOrder: number;
  id: string;
}

export const TaskbarButton = ({
  icon,
  text,
  onClick,
  isMinimized,
  initialOrder,
  id,
}: TaskbarButtonProps) => {
  const [order] = useState(initialOrder);

  return (
    <div
      data-id={id}
      style={{ order }}
      className={cx(
        "nice-transition",
        "mr-[5px]",
        "flex",
        "h-full",
        "items-center",
        "gap-2",
        "rounded-[25px]",
        "border-[1px]",
        "border-primaryColor",
        "animate-roll-in",
        "px-4",
        "py-1",
        "shadow-inner",
        {
          "shadow-sm": isMinimized,
          "taskbar-button--pushed": !isMinimized,
        },
      )}
      onClick={onClick}
    >
      {icon}
      <span className="text-primaryColor text-sm">{text}</span>
    </div>
  );
};

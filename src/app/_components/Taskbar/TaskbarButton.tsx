import { ReactNode, useEffect, useLayoutEffect, useState } from "react";
import cx from "classnames";
import "./TaskbarButton.css";
import { useBooleanForAnimation } from "~/app/utils/useBooleanForAnimation";

interface TaskbarButtonProps {
  icon: ReactNode;
  text: string;
  onClick: () => void;
  isMinimized: boolean;
  order: number;
  id: string;
  isOpen: boolean;
}

export const TaskbarButton = ({
  icon,
  text,
  onClick,
  isMinimized,
  order,
  id,
  isOpen,
}: TaskbarButtonProps) => {
  const [updateOrder, setUpdateOrder] = useState(true);
  const [currentOrder, setOrder] = useState(order);

  const [isActuallyOpen, isVisible] = useBooleanForAnimation(isOpen, 1, 300);

  useLayoutEffect(() => {
    if (isOpen && updateOrder) {
      setUpdateOrder(false);
      setOrder(order);
    }

    if (!isOpen) {
      setUpdateOrder(true);
    }
  }, [isOpen]);

  if (!isActuallyOpen) return null;

  return (
    <div
      style={{ order: currentOrder }}
      className={cx("taskbar-button-container", {
        "taskbar-button-container--visible": isVisible,
      })}
    >
      <div>
        <div
          data-id={id}
          className={cx(
            "taskbar-button",
            "flex",
            "h-full",
            "items-center",
            "gap-2",
            "rounded-[25px]",
            "border-[1px]",
            "border-borderColor",
            "px-4",
            "py-[5px]",
            "taskbar-button",
            {
              "shadow-sm": isMinimized,
              "taskbar-button--pushed": !isMinimized,
              "taskbar-button--visible": isVisible,
            },
          )}
          onClick={onClick}
        >
          <div className="flex-shrink-0">{icon}</div>
          <div className="taskbar-button__text text-xs text-borderColor">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};

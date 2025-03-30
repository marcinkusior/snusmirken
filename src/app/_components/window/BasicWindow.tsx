import React, { useState, useRef, useEffect, ReactNode } from "react";
import "./Window.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize, faXmark } from "@fortawesome/free-solid-svg-icons";
import { zIndexCounter } from "./windowZIndex";
import { useBooleanForAnimation } from "~/app/utils/useBooleanForAnimation";
import cx from "classnames";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  onClose?: () => void;
  icon?: ReactNode;
  isOpen: boolean;
  minimize: () => void;
  isMinimized: boolean;
  taskbarButtonId: string;
}

export const BasicWindow = ({
  title,
  children,
  defaultPosition = { x: 100, y: 100 },
  onClose,
  icon,
  isOpen,
  minimize,
  isMinimized,
  taskbarButtonId,
}: WindowProps) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(zIndexCounter.get());
  const [minizedPosition, setMinizedPosition] = useState({ x: 0, y: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  const updateMinizedPosition = () => {
    const taskbarButton = document.querySelector(
      `[data-id="${taskbarButtonId}"]`,
    );

    if (taskbarButton) {
      const rect = taskbarButton.getBoundingClientRect();

      console.log(rect);

      // const x = rect.x + rect.width / 2 - size.width / 2;
      // const y = rect.y + rect.height / 2 - size.height / 2;

      const windowRect = windowRef.current?.getBoundingClientRect();

      const x = rect.x + rect.width / 2 - windowRect.width / 2;
      const y = rect.y + rect.height / 2 - windowRect.height / 2;

      setMinizedPosition({
        x: x,
        y: y,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      zIndexCounter.increment();
      setZIndex(zIndexCounter.get());
    }

    if (!isMinimized) {
      zIndexCounter.increment();
      setZIndex(zIndexCounter.get());
    }

    if (isMinimized) {
      updateMinizedPosition();
    }
  }, [isOpen, isMinimized]);

  const [isWindowOpen, isWindowExpanded] = useBooleanForAnimation(
    isOpen,
    1,
    300,
  );

  const disableDragging = isMinimized;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        let positionY = e.clientY - dragStart.y;
        if (positionY < 0) positionY = 0;

        const positionX = e.clientX - dragStart.x;

        setPosition({
          x: positionX,
          y: positionY,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, position]);

  const handleDragStart = (e: React.MouseEvent) => {
    if (disableDragging) return;

    if (
      e.target instanceof HTMLElement &&
      e.target.closest(".window-controls")
    ) {
      return;
    }
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMinimize = () => {
    minimize();
  };

  const handleClose = () => {
    if (onClose) onClose();
  };

  if (!isWindowOpen) return null;

  return (
    <div
      onMouseDown={() => {
        zIndexCounter.increment();
        setZIndex(zIndexCounter.get());
      }}
      ref={windowRef}
      className={cx("window", "fixed", "overflow-hidden", "rounded-[22px]", {
        "window-expand": isWindowExpanded,
        "window-minimized": isMinimized,
        "window-transition-off": isDragging || isResizing,
      })}
      style={{
        top: isMinimized ? minizedPosition.y : position.y,
        left: isMinimized ? minizedPosition.x : position.x,
        zIndex: zIndex,
      }}
    >
      <div
        className="window-header bg-windowBackgroundColor text-primaryColor border-primaryColor flex h-10 cursor-move items-center justify-between border-b-[4px] px-4"
        onMouseDown={handleDragStart}
      >
        <span className="flex items-center gap-3 truncate">
          {icon}
          {title}
        </span>
        <div className="window-controls flex items-center space-x-2">
          <FontAwesomeIcon
            onClick={handleMinimize}
            icon={faWindowMinimize}
            className="cursor-pointer hover:opacity-70"
            size="lg"
          />

          <FontAwesomeIcon
            onClick={handleClose}
            icon={faXmark}
            className="cursor-pointer hover:opacity-70"
            size="xl"
          />
        </div>
      </div>

      <div className="h-[calc(100%-2.5rem)] overflow-auto p-4">{children}</div>
    </div>
  );
};

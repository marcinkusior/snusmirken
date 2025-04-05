import React, { useState, useRef, useEffect, ReactNode } from "react";
import "./Window.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDebounce } from "@uidotdev/usehooks";
import { faWindowMinimize, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import { zIndexCounter } from "./windowZIndex";
import { useBooleanForAnimation } from "~/app/utils/useBooleanForAnimation";
import cx from "classnames";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  onClose?: () => void;
  icon?: ReactNode;
  isOpen: boolean;
  minimize: () => void;
  isMinimized: boolean;
  taskbarButtonId: string;
  padding?: string;
}

export const Window = ({
  title,
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 300 },
  onClose,
  icon,
  isOpen,
  minimize,
  isMinimized,
  taskbarButtonId,
  padding = "16px",
}: WindowProps) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [originalSize, setOriginalSize] = useState(defaultSize);
  const [originalPosition, setOriginalPosition] = useState(defaultPosition);
  const [zIndex, setZIndex] = useState(zIndexCounter.get());
  const [minizedPosition, setMinizedPosition] = useState({ x: 0, y: 0 });

  const updateMinizedPosition = () => {
    const taskbarButton = document.querySelector(
      `[data-id="${taskbarButtonId}"]`,
    );

    if (taskbarButton) {
      const rect = taskbarButton.getBoundingClientRect();

      console.log(rect);

      const x = rect.x + rect.width / 2 - size.width / 2;
      const y = rect.y + rect.height / 2 - size.height / 2;

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

  const isMaximizedDebounce = useDebounce(isMaximized, 320);
  const disableDragging = isMaximizedDebounce || isMaximized || isMinimized;

  const windowRef = useRef<HTMLDivElement>(null);

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
      if (isResizing) {
        const newWidth = Math.max(200, e.clientX - position.x);
        const newHeight = Math.max(150, e.clientY - position.y);
        setSize({ width: newWidth, height: newHeight });
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

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
  };

  const handleMaximize = () => {
    const maximizedPadding = 10;

    if (!isMaximized) {
      setOriginalSize(size);
      setOriginalPosition(position);
      setSize({
        width: window.innerWidth - maximizedPadding * 2,
        height: window.innerHeight - maximizedPadding * 2,
      });
      setPosition({
        x: maximizedPadding,
        y: maximizedPadding,
      });
    } else {
      setSize(originalSize);
      setPosition(originalPosition);
    }
    setIsMaximized(!isMaximized);
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
        console.log("onMouseDown");
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
        width: size.width,
        height: size.height,
        top: isMinimized ? minizedPosition.y : position.y,
        left: isMinimized ? minizedPosition.x : position.x,
        zIndex: zIndex,
      }}
    >
      <div
        className="window-header flex h-10 cursor-move items-center justify-between border-b-[4px] border-borderColor bg-windowBackgroundColor px-4 text-borderColor"
        onMouseDown={handleDragStart}
        onDoubleClick={handleMaximize}
      >
        <span className="flex items-center gap-3 truncate">
          {icon}
          <span className="text-sm">{title}</span>
        </span>
        <div className="window-controls flex items-center space-x-2">
          <FontAwesomeIcon
            onClick={handleMinimize}
            icon={faWindowMinimize}
            className="cursor-pointer hover:opacity-60"
            size="lg"
          />

          <FontAwesomeIcon
            onClick={handleMaximize}
            icon={faWindowMaximize}
            className="cursor-pointer hover:opacity-60"
            size="lg"
          />

          <FontAwesomeIcon
            onClick={handleClose}
            icon={faXmark}
            className="cursor-pointer hover:opacity-60"
            size="xl"
          />
        </div>
      </div>

      <div
        className={`h-[calc(100%-2.5rem)] overflow-auto`}
        style={{ padding }}
      >
        {children}
      </div>

      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        >
          <div className="absolute bottom-1 left-[3px] top-[-1px] h-[11px] w-[4px] rotate-45 rounded-full bg-borderColor" />
        </div>
      )}
    </div>
  );
};

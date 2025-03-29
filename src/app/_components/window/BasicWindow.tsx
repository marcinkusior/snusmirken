import React, { useState, useRef, useEffect } from "react";
import "./Window.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize, faXmark } from "@fortawesome/free-solid-svg-icons";
import { zIndexCounter } from "./windowZIndex";
import { useDebounce } from "@uidotdev/usehooks";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  onClose?: () => void;
  isOpen: boolean;
  icon: React.ReactNode;
}

export const BasicWindow = ({
  title,
  children,
  defaultPosition = { x: 100, y: 100 },
  onClose,
  isOpen,
  icon,
}: WindowProps) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(zIndexCounter.get());

  useEffect(() => {
    if (isOpen) {
      zIndexCounter.increment();
      setZIndex(zIndexCounter.get());
    }
  }, [isOpen]);

  const isOpenDebounced = useDebounce(isOpen, 300);
  const isWindowOpen = isOpenDebounced || isOpen;
  const showCloseAnimation = !isOpen && isOpenDebounced;

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
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart, position]);

  const handleDragStart = (e: React.MouseEvent) => {
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

  const handleMinimize = () => {};

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
      className={`window expand-animation fixed overflow-hidden rounded-[22px] ${showCloseAnimation ? "retract-animation" : ""}`}
      style={{
        top: position.y,
        left: position.x,
        zIndex: zIndex,
      }}
    >
      <div
        className="flex h-10 cursor-move items-center justify-between border-b-[4px] border-prettyBlue bg-white px-4 text-prettyBlue"
        onMouseDown={handleDragStart}
      >
        <span className="flex items-center gap-2 truncate">
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

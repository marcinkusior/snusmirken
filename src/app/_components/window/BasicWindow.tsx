import React, { useState, useRef, useEffect } from "react";
import "./Window.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowMinimize, faXmark } from "@fortawesome/free-solid-svg-icons";
import { zIndexCounter } from "./windowZIndex";

interface WindowProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  onClose?: () => void;
}

export const BasicWindow = ({
  title,
  children,
  defaultPosition = { x: 100, y: 100 },
  onClose,
}: WindowProps) => {
  const [position, setPosition] = useState(defaultPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
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

  return (
    <div
      onMouseDown={() => {
        zIndexCounter.increment();
      }}
      ref={windowRef}
      className={`window fixed overflow-hidden rounded-[22px]`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: zIndexCounter.get(),
      }}
    >
      <div
        className="flex h-10 cursor-move items-center justify-between border-b-[4px] border-prettyBlue bg-white px-4 text-prettyBlue"
        onMouseDown={handleDragStart}
      >
        <span className="truncate font-bold">{title}</span>
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

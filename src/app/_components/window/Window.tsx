import React, { useState, useRef, useEffect } from "react";
import "./Window.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDebounce } from "@uidotdev/usehooks";
import {
  faWindowMinimize,
  faXmark,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faWindowMaximize } from "@fortawesome/free-regular-svg-icons";
import { z } from "zod";

let zIndexCounter = 1;

interface WindowProps {
  title: string;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  onClose?: () => void;
}

export const Window = ({
  title,
  children,
  defaultPosition = { x: 100, y: 100 },
  defaultSize = { width: 400, height: 300 },
  onClose,
}: WindowProps) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [originalSize, setOriginalSize] = useState(defaultSize);
  const [originalPosition, setOriginalPosition] = useState(defaultPosition);

  const isMaximizedDebounce = useDebounce(isMaximized, 320);
  const isTransitionActive = isMaximizedDebounce || isMaximized;

  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y,
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
    if (isTransitionActive) return;

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
    if (!isMaximized) {
      setOriginalSize(size);
      setOriginalPosition(position);
      setSize({ width: window.innerWidth, height: window.innerHeight });
      setPosition({ x: 0, y: 0 });
    } else {
      setSize(originalSize);
      setPosition(originalPosition);
    }
    setIsMaximized(!isMaximized);
  };

  const handleMinimize = () => {};

  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <div
      onMouseDown={() => {
        zIndexCounter++;
      }}
      ref={windowRef}
      className={`window fixed ${
        isTransitionActive ? "transition-all duration-300 ease-in-out" : ""
      }`}
      style={{
        width: size.width,
        height: size.height,
        transform: `translate(${position.x}px, ${position.y}px)`,
        zIndex: zIndexCounter,
      }}
    >
      {/* Window Title Bar */}
      <div
        className="bg-prettyBlue flex h-10 cursor-move items-center justify-between px-4 text-white"
        onMouseDown={handleDragStart}
        onDoubleClick={handleMaximize}
      >
        <span className="truncate font-semibold">{title}</span>
        <div className="window-controls flex items-center space-x-2">
          <FontAwesomeIcon
            onClick={handleMinimize}
            icon={faWindowMinimize}
            className="cursor-pointer hover:opacity-70"
            size="lg"
          />

          <FontAwesomeIcon
            onClick={handleMaximize}
            icon={faWindowMaximize}
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

      {/* Window Content */}
      <div className="h-[calc(100%-2.5rem)] overflow-auto p-4">{children}</div>

      {/* Resize Handle */}
      {!isMaximized && (
        <div
          className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize"
          onMouseDown={handleResizeStart}
        >
          {/* <div className="absolute bottom-1 right-1 h-2 w-2 rounded-sm bg-gray-400" /> */}
          <FontAwesomeIcon
            icon={faPlus}
            className="absolute bottom-1 right-1 text-gray-400"
            size="sm"
          />
        </div>
      )}
    </div>
  );
};

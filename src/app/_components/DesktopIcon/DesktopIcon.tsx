import React, { useState } from "react";
import { ReactNode } from "react";

export interface IconPosition {
  x: number;
  y: number;
}

export interface DesktopIconProps {
  icon: ReactNode;
  label: string;
  initialPosition?: IconPosition;
  onDoubleClick: () => void;
}

export const DesktopIcon: React.FC<DesktopIconProps> = ({
  icon,
  label,
  initialPosition = { x: 50, y: 50 },
  onDoubleClick,
  // onPositionChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(initialPosition);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);

    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.clientX && !e.clientY) return; // Ignore invalid drag events
    // onPositionChange(id, { x: e.clientX, y: e.clientY });
    // setPosition({ x: e.clientX, y: e.clientY });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.preventDefault();
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
    setIsDragging(false);
  };

  return (
    <div
      className={`absolute flex w-[105px] cursor-move select-none flex-col items-center rounded-lg border-2 border-transparent p-2 hover:border-nicePurple/50 hover:bg-nicePurple/10 ${isDragging ? "opacity-50" : ""} `}
      style={{
        left: position.x,
        top: position.y,
      }}
      draggable="true"
      onDragStart={handleDragStart}
      onDrag={handleDrag}
      onDragEnd={handleDragEnd}
      onDoubleClick={onDoubleClick}
    >
      <div className="text-primaryColor">{icon}</div>
      <span className="text-primaryColor break-words rounded bg-white/0 px-1 text-center text-xs font-medium">
        {label}
      </span>
    </div>
  );
};

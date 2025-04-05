import React, { useState, useCallback, useEffect } from "react";

interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  initialRightWidth?: number;
  minWidth?: number;
  containerRef: React.RefObject<HTMLDivElement>;
}

export function SplitPane({
  left,
  right,
  initialRightWidth = 250,
  minWidth = 100,
  containerRef,
}: SplitPaneProps) {
  const [rightWidth, setRightWidth] = useState(initialRightWidth);
  const [isDragging, setIsDragging] = useState(false);

  const startDragging = useCallback((_e: React.MouseEvent) => {
    setIsDragging(true);
  }, []);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      if (isDragging) {
        const splitPaneElement = containerRef.current;
        if (!splitPaneElement) return;

        const rect = splitPaneElement.getBoundingClientRect();
        const newWidth = rect.right - e.clientX;
        if (newWidth >= minWidth && newWidth <= window.innerWidth - minWidth) {
          setRightWidth(newWidth);
        }
      }
    },
    [isDragging, minWidth],
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", stopDragging);
      return () => {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", stopDragging);
      };
    }
  }, [isDragging, onMouseMove, stopDragging]);

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="h-full flex-1 overflow-auto">{left}</div>

      <div
        className="relative w-[2px] cursor-col-resize rounded-full bg-borderColor transition-colors"
        onMouseDown={startDragging}
      >
        <div className="absolute inset-y-0 left-[-4px] w-[10px]" />
      </div>

      <div className="h-full overflow-auto" style={{ width: rightWidth }}>
        {right}
      </div>
    </div>
  );
}

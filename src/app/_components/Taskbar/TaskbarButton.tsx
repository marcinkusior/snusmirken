import { LucideIcon } from "lucide-react";
import { ReactNode, useState } from "react";

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
      className={`nice-transition mr-[5px] flex h-full items-center gap-2 rounded-[25px] border-[1px] border-prettyBlue ${isMinimized ? "bg-white" : "bg-prettyBlue/10"} px-4 py-1 shadow-inner`}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm text-prettyBlue">{text}</span>
    </div>
  );
};

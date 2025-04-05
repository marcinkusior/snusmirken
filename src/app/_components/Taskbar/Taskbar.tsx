import {
  Settings,
  HelpCircle,
  Search,
  Power,
  Mail,
  Music2,
  FileText,
  Calendar,
} from "lucide-react";
import cx from "classnames";
import "./Taskbar.css";

import { useEffect, useRef, useState } from "react";
import { ActivePrograms } from "./ActivePrograms";

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded rounded-[20px] p-2 hover:bg-primaryColor">
      {icon}
      <span>{label}</span>
    </div>
  );
}

export const Taskbar = () => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const startMenuRef = useRef<HTMLDivElement>(null);

  const currentTime = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        startMenuRef.current &&
        startButtonRef.current &&
        !startMenuRef.current.contains(event.target as Node) &&
        !startButtonRef.current.contains(event.target as Node)
      ) {
        setIsStartMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* {isStartMenuOpen && ( */}
      <div
        ref={startMenuRef}
        className={cx(
          "taskbar absolute bottom-[86px] left-[1.5vw] z-[99999] w-80 overflow-hidden rounded-[20px] rounded-tr-lg border-2 border-borderColor bg-windowBackgroundColor shadow-xl",
          {
            "taskbar--open": isStartMenuOpen,
          },
        )}
      >
        {/* User Profile Section */}
        <div className="flex items-center gap-4 border-b-[2px] border-borderColor p-4 text-borderColor">
          <div className="flex h-12 w-12 items-center justify-center rounded-full">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100"
              alt="User"
              className="h-10 w-10 rounded-full"
            />
          </div>
          <span className="font-semibold">User Name</span>
        </div>

        {/* Menu Items */}
        <div className="p-2">
          <MenuItem icon={<Mail />} label="Outlook Express" />
          <MenuItem icon={<Music2 />} label="Windows Media Player" />
          <MenuItem icon={<FileText />} label="Notepad" />
          <MenuItem icon={<Calendar />} label="Calendar" />
          <div className="my-2 border-t border-gray-400" />
          <MenuItem icon={<Settings />} label="Control Panel" />
          <MenuItem icon={<HelpCircle />} label="Help and Support" />
          <MenuItem icon={<Search />} label="Search" />
          <div className="my-2 border-t border-gray-400" />
          <MenuItem
            icon={<Power className="text-red-600" />}
            label="Turn Off Computer"
          />
        </div>
      </div>
      {/* )} */}
      <div className="shadow-bl absolute bottom-[36px] left-[1vw] flex h-[46px] w-[98vw] items-center justify-between rounded-[40px] border-[2px] border-borderColor bg-windowBackgroundColor pb-1 pl-1 pr-3 pt-1">
        <button
          ref={startButtonRef}
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className={`br-2 flex flex-grow-0 items-center gap-2 px-2 py-1 text-borderColor`}
        >
          <span
            className={cx(
              "p bold nice-transition mr-[5px] rounded-[19px] border-2 border-transparent p-[3px] pl-3 pr-3 text-xs hover:border-primaryColor",
              isStartMenuOpen ? "bg-primaryColor text-white" : "",
            )}
          >
            Start
          </span>
        </button>

        <div className="flex-grow">
          <ActivePrograms />
        </div>

        {/* System Tray */}
        <div className="flex flex-grow-0 items-center gap-2 px-2 py-1">
          <span className="text-xs">{currentTime}</span>
        </div>
      </div>
      ;
    </>
  );
};

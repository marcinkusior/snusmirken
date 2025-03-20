import {
  Monitor,
  FolderOpen,
  Settings,
  HelpCircle,
  Search,
  Power,
  Mail,
  Music2,
  Image,
  FileText,
  Calendar,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

function MenuItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex cursor-pointer items-center gap-3 rounded p-2 hover:bg-[#316AC5] hover:text-white">
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
      {isStartMenuOpen && (
        <div
          ref={startMenuRef}
          className="absolute bottom-[63px] left-0 z-[99999] w-80 rounded-tr-lg border-2 border-[#0A246A] bg-[#ECE9D8] shadow-xl"
        >
          {/* User Profile Section */}
          <div className="flex items-center gap-4 bg-[#225FD7] p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100"
                alt="User"
                className="h-10 w-10 rounded-full"
              />
            </div>
            <span className="font-semibold text-white">User Name</span>
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
      )}
      <div className="bg-prettyBlue absolute bottom-[23px] flex h-10 w-full items-center justify-between px-1">
        <button
          ref={startButtonRef}
          onClick={() => setIsStartMenuOpen(!isStartMenuOpen)}
          className={`bg-prettyBlue br-2 flex items-center gap-2 rounded border-white px-2 py-1 text-white`}
        >
          <span className="font-bold">Start</span>
        </button>

        {/* System Tray */}
        <div className="flex items-center gap-2 bg-[#ECE9D8] px-2 py-1">
          <span className="text-sm">{currentTime}</span>
        </div>
      </div>
      ;
    </>
  );
};

import React, { useState, useEffect, useRef } from "react";

type DropdownOption = {
  label: string;
  action: () => void;
};

type DropdownMenu = {
  label: string;
  options: DropdownOption[];
};

type FileMenuProps = {
  menus: DropdownMenu[];
};

const FileMenu: React.FC<FileMenuProps> = ({ menus }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const menuRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      openMenuIndex !== null &&
      menuRefs.current[openMenuIndex] &&
      !menuRefs.current[openMenuIndex]?.contains(event.target as Node)
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuIndex]);

  return (
    <div className="flex border-b-2 border-borderColor bg-windowBackgroundColor">
      {menus.map((menu, index) => (
        <div
          key={index}
          ref={(el) => (menuRefs.current[index] = el)}
          className="relative"
        >
          {/* Menu Label */}
          <button
            onClick={() => setIsMenuOpen(true)}
            onMouseEnter={() => setOpenMenuIndex(index)}
            className="border-r border-borderColor bg-white px-4 py-[6px] text-sm font-medium text-gray-700 hover:bg-primaryColor"
          >
            {menu.label}
          </button>

          {/* Dropdown Options */}
          {openMenuIndex === index && isMenuOpen && (
            <div className="absolute left-[-1px] top-[33px] flex flex-col overflow-hidden whitespace-nowrap rounded-bl-[10px] rounded-br-[10px] border border-borderColor bg-white shadow-xl">
              {menu.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => {
                    option.action();
                    setIsMenuOpen(false);
                  }}
                  className="break-keep px-4 py-2 text-left text-sm text-gray-700 hover:bg-primaryColor"
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FileMenu;

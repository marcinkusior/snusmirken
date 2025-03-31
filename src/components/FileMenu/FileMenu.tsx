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
    <div className="border-borderColor flex border-b-2 shadow-md">
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
            className="bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            {menu.label}
          </button>

          {/* Dropdown Options */}
          {openMenuIndex === index && isMenuOpen && (
            <div className="absolute left-0 mt-1 w-48 rounded-md border border-gray-300 bg-white shadow-lg">
              {menu.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={option.action}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
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

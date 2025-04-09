import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";

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
  className?: string;
};

const FileMenu: React.FC<FileMenuProps> = ({ menus, className }) => {
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
    <div
      className={classNames(
        "flex border-b-2 border-borderColor bg-windowBackgroundColor",
        className,
      )}
    >
      {menus.map((menu, index) => (
        <div
          key={index}
          ref={(el) => {
            menuRefs.current[index] = el;
          }}
          className="relative"
        >
          {/* Menu Label */}
          <button
            onClick={() => setIsMenuOpen(true)}
            onMouseEnter={() => setOpenMenuIndex(index)}
            className={classNames(
              "nice-transition border-r border-borderColor bg-white px-4 py-[6px] text-sm font-medium text-gray-700 hover:bg-primaryColor",
              openMenuIndex === index && isMenuOpen && "bg-primaryColor",
            )}
          >
            {menu.label}
          </button>

          {/* Dropdown Options */}
          {openMenuIndex === index && isMenuOpen && (
            <div
              className={classNames(
                "absolute left-[-1px] top-[33px] flex flex-col overflow-hidden whitespace-nowrap rounded-bl-[10px] rounded-br-[10px] border border-borderColor bg-white shadow-xl",
                "animate-fadeIn",
              )}
            >
              {menu.options.map((option, optionIndex) => (
                <button
                  key={optionIndex}
                  onClick={() => {
                    option.action();
                    setIsMenuOpen(false);
                  }}
                  className={classNames(
                    "nice-transition break-keep px-4 py-2 text-left text-sm text-gray-700 hover:bg-primaryColor",
                    optionIndex === menu.options.length - 1 &&
                      "rounded-b-[10px]",
                  )}
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

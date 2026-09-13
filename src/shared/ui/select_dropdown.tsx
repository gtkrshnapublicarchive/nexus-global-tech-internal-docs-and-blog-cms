"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
}

interface SelectDropdownProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  align?: "left" | "right";
  className?: string;
}

export function SelectDropdown({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  size = "md",
  align = "left",
  className = "",
}: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const isSmall = size === "sm";

  return (
    <div
      ref={containerRef}
      className={`relative ${isOpen ? "z-30" : "z-10"} ${className}`}
    >
      {/* Themed Select Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex w-full items-center justify-between rounded-xl border border-black/10 bg-white text-left text-[#20211f] transition hover:border-black/20 focus:border-[#668c63] focus:outline-none focus:ring-2 focus:ring-[#668c63]/20 disabled:cursor-not-allowed disabled:opacity-50 ${
          isSmall ? "px-2.5 py-1.5 text-xs" : "px-3.5 py-2.5 text-sm"
        }`}
      >
        <span className="truncate font-medium">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div
          className={`pointer-events-none ml-2 shrink-0 text-[#737870] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#20211f]" : ""
          }`}
        >
          <ChevronDown className={isSmall ? "h-3.5 w-3.5" : "h-4 w-4"} />
        </div>
      </button>

      {/* Themed Custom Popover Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 rounded-xl border border-black/8 bg-white p-1.5 shadow-lg shadow-black/8 animate-in fade-in zoom-in-95 duration-100 ${
            align === "right"
              ? "right-0 origin-top-right"
              : "left-0 origin-top-left"
          } ${isSmall ? "min-w-[130px]" : "min-w-full"}`}
        >
          <div className="max-h-60 overflow-y-auto space-y-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition cursor-pointer ${
                    isSmall ? "text-xs" : "text-sm"
                  } ${
                    isSelected
                      ? "bg-[#eef2ec] font-medium text-[#252824]"
                      : "text-[#626760] hover:bg-[#f2f5f0] hover:text-[#20211f]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{option.label}</span>
                    {option.badge && (
                      <span className="rounded bg-black/6 px-1.5 py-0.5 text-[10px] font-semibold text-[#686d66]">
                        {option.badge}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#5a8357]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

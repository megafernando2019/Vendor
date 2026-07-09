'use client'
import React, { useState, useCallback, useRef, FC } from "react";
import { useClickAway } from "react-use";

interface Option {
   value: string;
   text: string;
}

type NiceSelectProps = {
   options: Option[];
   defaultCurrent: number;
   placeholder: string;
   className?: string;
   onChange: (item: Option, name: string) => void;
   name: string;
   ariaLabel?: string;
}

const NiceSelect: FC<NiceSelectProps> = ({
   options,
   defaultCurrent,
   placeholder,
   className,
   onChange,
   name,
   ariaLabel = "Select option",
}) => {
   const [open, setOpen] = useState(false);
   const [selectedOption, setSelectedOption] = useState<Option | null>(null);
   const current = selectedOption ?? options[defaultCurrent];
   const onClose = useCallback(() => {
      setOpen(false);
   }, []);
   const ref = useRef<HTMLDivElement | null>(null);

   useClickAway(ref, onClose);

   const currentHandler = (item: Option) => {
      setSelectedOption(item);
      onChange(item, name);
      onClose();
   };

   return (
      <div
         ref={ref}
         className={`nice-select form-select-lg ${className || ""} ${open ? "open" : ""}`}
      >
         <button
            type="button"
            className="nice-select-trigger"
            aria-label={ariaLabel}
            aria-haspopup="listbox"
            aria-expanded={open}
            onClick={() => setOpen((prev) => !prev)}
         >
            <span className="current">{current?.text || placeholder}</span>
         </button>
         <ul
            className="list"
            role="menubar"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
         >
            {options?.map((item) => (
               <li
                  key={item.value}
                  data-value={item.value}
                  className={`option ${item.value === current?.value ? "selected focus" : ""
                     }`}
                  style={{ fontSize: '14px' }}
                  role="menuitem"
                  onClick={() => currentHandler(item)}
                  onKeyDown={(e) => e}
               >
                  {item.text}
               </li>
            ))}
         </ul>
      </div>
   );
};

export default NiceSelect;

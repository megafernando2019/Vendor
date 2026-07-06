"use client";

import Image from "next/image";
import { destinoOptions } from "./searchFormOptionsData";

type SearchFormDestinoOptionsProps = {
  selectedDestinoId: string;
  onSelectDestination: (destinoId: string) => void;
};

const SearchFormDestinoOptions = ({
  selectedDestinoId,
  onSelectDestination,
}: SearchFormDestinoOptionsProps) => (
  <>
    {destinoOptions.map((dest) => (
      <li
        key={dest.value}
        className={selectedDestinoId === dest.value ? "selected" : ""}
      >
        <button
          type="button"
          className="tg-booking-form-option-btn"
          onClick={() => onSelectDestination(dest.value)}
        >
          <Image src={dest.icon} width={30} height={30} alt={dest.label} />
          <span>{dest.label}</span>
        </button>
      </li>
    ))}
  </>
);

export default SearchFormDestinoOptions;

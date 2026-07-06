"use client";

import Image from "next/image";
import { pasajerosOptions } from "./searchFormOptionsData";

type SearchFormPasajerosOptionsProps = {
  selectedPasajerosId: string;
  onSelectPassengers: (pasajerosId: string) => void;
};

const SearchFormPasajerosOptions = ({
  selectedPasajerosId,
  onSelectPassengers,
}: SearchFormPasajerosOptionsProps) => (
  <>
    {pasajerosOptions.map((option) => (
      <li
        key={option.value}
        className={selectedPasajerosId === option.value ? "selected" : ""}
      >
        <button
          type="button"
          className="tg-booking-form-option-btn"
          onClick={() => onSelectPassengers(option.value)}
        >
          <Image src={option.icon} width={30} height={30} alt={option.label} />
          <span>{option.label}</span>
        </button>
      </li>
    ))}
  </>
);

export default SearchFormPasajerosOptions;

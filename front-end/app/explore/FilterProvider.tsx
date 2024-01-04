import React, { createContext, useContext, useState } from "react";

interface FilterContextProps {
  experienceFilter: string | null;
  setExperienceFilter: React.Dispatch<React.SetStateAction<string | null>>;
  hoursFromFilter: number | null;
  setHoursFromFilter: React.Dispatch<React.SetStateAction<number | null>>;
  hoursToFilter: number | null;
  setHoursToFilter: React.Dispatch<React.SetStateAction<number | null>>;
  hourValidationMessage: string | null;
  setHourValidationMessage: React.Dispatch<React.SetStateAction<string | null>>;
  validateHours: (from: number | null, to: number | null) => boolean;
  sortByFilter: string | null;
  setSortByFilter: React.Dispatch<React.SetStateAction<string | null>>;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

export function useFilterContext() {
  return useContext(FilterContext);
}

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [experienceFilter, setExperienceFilter] = useState<string | null>(null);
  const [hoursFromFilter, setHoursFromFilter] = useState<number | null>(0);
  const [hoursToFilter, setHoursToFilter] = useState<number | null>(500);
  const [hourValidationMessage, setHourValidationMessage] = useState<string | null>(null);
  const [sortByFilter, setSortByFilter] = useState<string | null>(null);


  const validateHours = (from: number | null, to: number | null): boolean => {
    if (from === null || to === null) {
      setHourValidationMessage(null);
      return true;
    }
    if (to <= from) {
      setHourValidationMessage("To should be greater than From");
      setTimeout(() => setHourValidationMessage(null), 1500);
      return false;
    }
    setHourValidationMessage(null);
    return true;
  };

  const contextValue = {
    experienceFilter,
    setExperienceFilter,
    hoursFromFilter,
    setHoursFromFilter,
    hoursToFilter,
    setHoursToFilter,
    hourValidationMessage,
    setHourValidationMessage,
    validateHours,
    sortByFilter,
    setSortByFilter,
  };

  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
}

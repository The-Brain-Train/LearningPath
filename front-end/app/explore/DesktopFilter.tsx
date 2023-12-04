import { useQueryClient } from "@tanstack/react-query";
import { useFilterContext } from "./FilterProvider";
import { Alert } from "@mui/material";

export default function DesktopFilter() {
  const queryClient = useQueryClient();

  const filterContext = useFilterContext();

  if (!filterContext) {
    return null;
  }

  const {
    experienceFilter,
    setExperienceFilter,
    hoursFromFilter,
    setHoursFromFilter,
    hoursToFilter,
    setHoursToFilter,
    hourValidationMessage,
    validateHours,
  } = filterContext;

  return (
    <div className="max-w-lg my-5 mx-auto flex flex-row gap-x-10 content-center items-center">
      <select
        value={experienceFilter || ""}
        onChange={(e) => {
          setExperienceFilter(e.target.value || null);
          queryClient.setQueryData(["experienceLevel"], e.target.value);
          queryClient.invalidateQueries(["roadmaps"]);
        }}
        className="rounded-md  w-full sm:h-12 px-4"
      >
        <option value="">Experience Level</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
      </select>
      <div className="flex flex-col">
        <div className="flex flex-row gap-x-2.5 items-center">
          <span className="text-white">Hours:</span>
          <input
            type="number"
            min="0"
            max="500"
            step="10"
            value={hoursFromFilter === null ? "" : hoursFromFilter}
            onChange={(e) => {
              const newValue =
                e.target.value === "" ? null : parseInt(e.target.value);
              validateHours(newValue, hoursToFilter) &&
                setHoursFromFilter(newValue);
              queryClient.setQueryData(["hoursFromFilter"], newValue);
              queryClient.invalidateQueries(["roadmaps"]);
            }}
            placeholder="From"
            className="rounded-md h-11 w-20 text-center"
          />
          <p className="text-white font-semibold flex justify-center items-center">
            -
          </p>
          <input
            type="number"
            min="0"
            max="500"
            step="10"
            value={hoursToFilter === null ? "" : hoursToFilter}
            onChange={(e) => {
              const newValue =
                e.target.value === "" ? null : parseInt(e.target.value);
              validateHours(hoursFromFilter, newValue) &&
                setHoursToFilter(newValue);
              queryClient.setQueryData(["hoursToFilter"], newValue);
              queryClient.invalidateQueries(["roadmaps"]);
            }}
            placeholder="To"
            className="rounded-md h-11 w-20 text-center"
          />
        </div>
      </div>  
    </div>
  );
}

import { useFilterContext } from "./FilterProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function FilterShow() {
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
    <div className="w-60 max-w-xs mx-auto md:hidden mt-5 mb-10">
      <select
        value={experienceFilter || ""}
        onChange={(e) => {
          setExperienceFilter(e.target.value || null);
          queryClient.setQueryData(["experienceLevel"], e.target.value);
          queryClient.invalidateQueries(["roadmaps"]);
        }}
        className="rounded-md h-7 w-full"
      >
        <option value="">Experience Level</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="expert">Expert</option>
      </select>
      <div className="flex flex-row justify-between mt-4">
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
          }}
          placeholder="From"
          className="rounded-md h-7 w-45 mx-2.5 text-center"
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
          className="rounded-md h-7 w-45 ml-2.5 text-center"
        />
      </div>
    </div>
  );
}

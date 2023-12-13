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
    validateHours,
  } = filterContext;

  return (
    <div className="max-w-sm mb-5 md:mb-0">
      <p className="text-white text-xs border-b border-slate-500 mb-2">Filters</p>
      <div className="flex gap-4">
        <div className="relative">
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-white transition hover:border-gray-600">
              <span className="text-sm font-medium"> Experience </span>
              <span className="transition group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </summary>
            <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
              <div className="w-30 rounded border border-gray-200 bg-white">
                <ul className="space-y-1 border-t border-gray-200 p-4">
                  <li>
                    <label
                      htmlFor="FilterBeginner"
                      className="inline-flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        id="FilterBeginner"
                        className="h-5 w-5 rounded border-gray-300"
                        checked={experienceFilter === "beginner"}
                        onChange={(e) => {
                          const newValue = e.target.checked ? "beginner" : null;
                          setExperienceFilter(newValue);
                          queryClient.setQueryData(
                            ["experienceLevel"],
                            newValue
                          );
                          queryClient.invalidateQueries(["roadmaps"]);
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Beginner
                      </span>
                    </label>
                  </li>
                  <li>
                    <label
                      htmlFor="FilterPreOrder"
                      className="inline-flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        id="FilterPreOrder"
                        className="h-5 w-5 rounded border-gray-300"
                        checked={experienceFilter === "intermediate"}
                        onChange={(e) => {
                          const newValue = e.target.checked
                            ? "intermediate"
                            : null;
                          setExperienceFilter(newValue);
                          queryClient.setQueryData(
                            ["experienceLevel"],
                            newValue
                          );
                          queryClient.invalidateQueries(["roadmaps"]);
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {" "}
                        Intermediate
                      </span>
                    </label>
                  </li>
                  <li>
                    <label
                      htmlFor="FilterOutOfStock"
                      className="inline-flex items-center gap-2"
                    >
                      <input
                        type="checkbox"
                        id="FilterOutOfStock"
                        className="h-5 w-5 rounded border-gray-300"
                        checked={experienceFilter === "expert"}
                        onChange={(e) => {
                          const newValue = e.target.checked ? "expert" : null;
                          setExperienceFilter(newValue);
                          queryClient.setQueryData(
                            ["experienceLevel"],
                            newValue
                          );
                          queryClient.invalidateQueries(["roadmaps"]);
                        }}
                      />
                      <span className="text-sm font-medium text-gray-700">
                        {" "}
                        Expert
                      </span>
                    </label>
                  </li>
                </ul>
              </div>
            </div>
          </details>
        </div>
        <div className="relative">
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-white transition hover:border-gray-600">
              <span className="text-sm font-medium"> Hours </span>
              <span className="transition group-open:-rotate-180">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </span>
            </summary>
            <div className="z-50 group-open:absolute group-open:start-0 group-open:top-auto group-open:mt-2">
              <div className="w-44 rounded border border-gray-200 bg-white">
                <header className="flex items-center justify-between p-4">
                  <button
                    type="button"
                    className="text-sm text-gray-900 underline underline-offset-4"
                    onClick={() => {
                      setHoursFromFilter(null);
                      setHoursToFilter(null);
                      queryClient.setQueryData(["hoursFromFilter"], null);
                      queryClient.setQueryData(["hoursToFilter"], null);
                      queryClient.invalidateQueries(["roadmaps"]);
                    }}
                  >
                    Reset
                  </button>
                </header>
                <div className="border-t border-gray-200 p-4">
                  <div className="flex justify-between gap-4">
                    <label
                      htmlFor="FilterPriceFrom"
                      className="flex items-center gap-2"
                    >
                      <input
                        type="number"
                        step="10"
                        id="FilterPriceFrom"
                        placeholder="From"
                        className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                        value={hoursFromFilter === null ? "" : hoursFromFilter}
                        onChange={(e) => {
                          const newValue =
                            e.target.value === ""
                              ? null
                              : parseInt(e.target.value);
                          validateHours(newValue, hoursToFilter) &&
                            setHoursFromFilter(newValue);
                          queryClient.setQueryData(
                            ["hoursFromFilter"],
                            newValue
                          );
                          queryClient.invalidateQueries(["roadmaps"]);
                        }}
                      />
                    </label>
                    <label
                      htmlFor="FilterPriceTo"
                      className="flex items-center gap-2"
                    >
                      <input
                        type="number"
                        step="10"
                        id="FilterPriceTo"
                        placeholder="To"
                        className="w-full rounded-md border-gray-200 shadow-sm sm:text-sm"
                        value={hoursToFilter === null ? "" : hoursToFilter}
                        onChange={(e) => {
                          const newValue =
                            e.target.value === ""
                              ? null
                              : parseInt(e.target.value);
                          validateHours(hoursFromFilter, newValue) &&
                            setHoursToFilter(newValue);
                          queryClient.setQueryData(["hoursToFilter"], newValue);
                          queryClient.invalidateQueries(["roadmaps"]);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}

import { createContext, useMemo, useContext } from "react";
import { ICohort, CohortProviderProps } from "@/types/useCohort";
import { Cohort } from "@/types/cohorts";
import useFetch, { isFetching } from "../useFetch";

const CohortContext = createContext<ICohort>({
  cohorts: undefined,
  currentCohortYear: undefined,
  isLoading: false,
});

export const CohortProvider = ({ children }: CohortProviderProps) => {
  const { data: currentCohort, status: currentCohortYearStatus } =
    useFetch<Cohort>({ endpoint: "/cohorts/latest" });
  const { data: cohorts, status: cohortsStatus } = useFetch<Cohort[]>({
    endpoint: "/cohorts",
  });
  const currentCohortYear = currentCohort?.academicYear;
  const isLoading = isFetching(currentCohortYearStatus, cohortsStatus);

  const memoedValue = useMemo(
    () => ({
      cohorts,
      currentCohortYear,
      isLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCohortYear]
  );

  return (
    <CohortContext.Provider value={memoedValue}>
      {!isLoading && children}
    </CohortContext.Provider>
  );
};

export default function useCohort() {
  return useContext(CohortContext);
}

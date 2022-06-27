import { createContext, useMemo, useContext } from "react";
import {
  ICohort,
  CohortProviderProps,
} from "@/hooks/useCohort/useCohort.types";
import { GetCohortResponse, GetCohortsResponse } from "@/types/cohorts";
import useFetch, { isFetching } from "../useFetch";

const CohortContext = createContext<ICohort>({
  cohorts: undefined,
  currentCohortYear: undefined,
  isLoading: false,
});

export const CohortProvider = ({ children }: CohortProviderProps) => {
  const { data: latestCohortResponse, status: currentCohortYearStatus } =
    useFetch<GetCohortResponse>({ endpoint: "/cohorts/latest" });
  const { data: cohortsResponse, status: cohortsStatus } =
    useFetch<GetCohortsResponse>({
      endpoint: "/cohorts",
    });
  const currentCohortYear = latestCohortResponse?.cohort?.academicYear;
  const cohorts = cohortsResponse?.cohorts;
  const isLoading = isFetching(currentCohortYearStatus, cohortsStatus);

  const memoedValue = useMemo(
    () => ({
      cohorts,
      currentCohortYear,
      isLoading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cohortsResponse, latestCohortResponse]
  );

  return (
    <CohortContext.Provider value={memoedValue}>
      {children}
    </CohortContext.Provider>
  );
};

export default function useCohort() {
  return useContext(CohortContext);
}

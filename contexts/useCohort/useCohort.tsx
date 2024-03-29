import { createContext, useMemo, useContext, useEffect } from "react";
import {
  ICohort,
  CohortProviderProps,
} from "@/contexts/useCohort/useCohort.types";
import { GetCohortResponse, GetCohortsResponse } from "@/types/api";
import useFetch, { isError, isFetching } from "../../hooks/useFetch";
import useSnackbarAlert from "../useSnackbarAlert";

const CohortContext = createContext<ICohort>({
  cohorts: undefined,
  currentCohortYear: undefined,
  isLoading: false,
});

export const CohortProvider = ({ children }: CohortProviderProps) => {
  const { setError } = useSnackbarAlert();

  const {
    data: latestCohortResponse,
    status: currentCohortYearStatus,
    error,
  } = useFetch<GetCohortResponse>({ endpoint: "/cohorts/current" });
  const { data: cohortsResponse, status: cohortsStatus } =
    useFetch<GetCohortsResponse>({
      endpoint: "/cohorts",
    });
  const currentCohortYear = latestCohortResponse?.cohort?.academicYear;
  const cohorts = cohortsResponse?.cohorts;
  const isLoading = isFetching(currentCohortYearStatus, cohortsStatus);

  useEffect(() => {
    if (isError(currentCohortYearStatus)) {
      setError(
        error ??
          "An error has been encountered while fetching the latest cohort"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCohortYearStatus]);

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

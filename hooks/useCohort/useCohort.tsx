import { createContext, useMemo, useContext, useEffect } from "react";
import {
  ICohort,
  CohortProviderProps,
} from "@/hooks/useCohort/useCohort.types";
import { GetCohortResponse, GetCohortsResponse } from "@/types/cohorts";
import useFetch, { isError, isFetching } from "../useFetch";
import SnackbarAlert from "@/components/layout/SnackbarAlert";
import useSnackbarAlert from "../useSnackbarAlert";

const CohortContext = createContext<ICohort>({
  cohorts: undefined,
  currentCohortYear: undefined,
  isLoading: false,
});

export const CohortProvider = ({ children }: CohortProviderProps) => {
  const { snackbar, handleClose, setError } = useSnackbarAlert();

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
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      {children}
    </CohortContext.Provider>
  );
};

export default function useCohort() {
  return useContext(CohortContext);
}

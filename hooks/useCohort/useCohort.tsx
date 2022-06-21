import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { ApiServiceBuilder } from "@/helpers/api";
import { HTTP_METHOD } from "@/types/api";
import {
  ICohort,
  CohortProviderProps,
  DEFAULT_COHORT_YEAR,
} from "@/types/useCohort";

const CohortContext = createContext<ICohort>({
  currentCohortYear: DEFAULT_COHORT_YEAR,
  loading: false,
});

export const CohortProvider = ({ children }: CohortProviderProps) => {
  const [currentCohortYear, setCurrentCohortYear] =
    useState<number>(DEFAULT_COHORT_YEAR);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCurrentCohortYear = async () => {
      setLoading(true);
      const apiServiceBuilder = new ApiServiceBuilder({
        method: HTTP_METHOD.GET,
        endpoint: "/cohorts/latest",
      });
      const apiService = apiServiceBuilder.build();
      const latestCohortYearResponse = await apiService();

      if (latestCohortYearResponse.ok) {
        const { academicYear } = await latestCohortYearResponse.json();
        setCurrentCohortYear(Number(academicYear));
      }
      setLoading(false);
    };

    getCurrentCohortYear();
  }, []);

  const memoedValue = useMemo(
    () => ({
      currentCohortYear,
      loading,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCohortYear]
  );

  return (
    <CohortContext.Provider value={memoedValue}>
      {!loading && children}
    </CohortContext.Provider>
  );
};

export default function useCohort() {
  return useContext(CohortContext);
}

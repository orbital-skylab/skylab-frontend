import { createContext, useState, useEffect, useMemo, useContext } from "react";
import { ApiServiceBuilder } from "@/helpers/api";
import { HTTP_METHOD } from "@/types/api";
import { ICohort, CohortProviderProps } from "@/types/useCohort";
import { Cohort } from "@/types/cohorts";

const CohortContext = createContext<ICohort>({
  currentCohortYear: null,
  isLoading: false,
});

export const CohortProvider = ({ children }: CohortProviderProps) => {
  const [currentCohortYear, setCurrentCohortYear] = useState<
    Cohort["academicYear"] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCurrentCohortYear = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };

    getCurrentCohortYear();
  }, []);

  const memoedValue = useMemo(
    () => ({
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

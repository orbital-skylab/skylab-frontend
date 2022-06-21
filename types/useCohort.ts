import { Cohort } from "./cohorts";

export interface ICohort {
  cohorts: Cohort[] | undefined;
  currentCohortYear: number | undefined;
  isLoading: boolean;
}

export interface CohortProviderProps {
  children?: React.ReactNode;
}

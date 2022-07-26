import { Cohort } from "../../types/cohorts";

export interface ICohort {
  cohorts: Cohort[] | undefined;
  currentCohortYear: Cohort["academicYear"] | undefined;
  isLoading: boolean;
}

export interface CohortProviderProps {
  children?: React.ReactNode;
}

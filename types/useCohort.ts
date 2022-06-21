export interface ICohort {
  currentCohortYear: number;
  loading: boolean;
}

export interface CohortProviderProps {
  children?: React.ReactNode;
}

export const DEFAULT_COHORT_YEAR = 2022;

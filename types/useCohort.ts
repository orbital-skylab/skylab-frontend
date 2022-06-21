export interface ICohort {
  currentCohortYear: number | null;
  isLoading: boolean;
}

export interface CohortProviderProps {
  children?: React.ReactNode;
}

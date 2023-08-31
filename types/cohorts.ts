export type Cohort = {
  startDate: string;
  endDate: string;
  academicYear: number;
};

/**
 * TODO: Shift to `/types/api.ts`
 */
export type GetCohortsResponse = {
  cohorts: Cohort[];
};

export type GetCohortResponse = {
  cohort: Cohort;
};

export type AddCohortResponse = GetCohortResponse;

export type EditCohortResponse = GetCohortResponse;

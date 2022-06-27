export type Cohort = {
  startDate: string;
  endDate: string;
  academicYear: number;
};

export type GetCohortsResponse = {
  cohorts: Cohort[];
};

export type GetCohortResponse = {
  cohort: Cohort;
};

export type AddCohortResponse = GetCohortResponse;

export type EditCohortResponse = GetCohortResponse;

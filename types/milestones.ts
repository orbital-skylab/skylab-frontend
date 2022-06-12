import { Cohort } from "./cohorts";

export type Milestone = {
  name: string;
  startDate: string;
  endDate: string;
  cohort: Cohort;
};

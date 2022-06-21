import { Cohort } from "./cohorts";
import { UserMetadata } from "./users";

export type FacilitatorMetadata = {
  cohortYear: Cohort["academicYear"];
};

export type Facilitator = UserMetadata &
  FacilitatorMetadata & { facilitatorId: number };

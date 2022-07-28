import { Cohort } from "./cohorts";
import { Team } from "./teams";
import { UserMetadata } from "./users";

export type AdviserMetadata = {
  cohortYear: Cohort["academicYear"];
  teamIds: Team["id"][];
  nusnetId: string;
  matricNo: string;
};

export type Adviser = UserMetadata & AdviserMetadata & { adviserId: number };

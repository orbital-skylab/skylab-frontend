import { Cohort } from "./cohorts";
import { Project } from "./projects";
import { UserMetadata } from "./users";

export type AdviserMetadata = {
  cohortYear: Cohort["academicYear"];
  projectIds: Project["id"][];
  nusnetId: string;
  matricNo: string;
};

export type Adviser = UserMetadata & AdviserMetadata & { adviserId: number };

import { Cohort } from "./cohorts";
import { Team } from "./teams";
import { UserMetadata } from "./users";

export type StudentMetadata = {
  cohortYear: Cohort["academicYear"];
  teamId: Team["id"];
  nusnetId: string;
  matricNo: string;
};

export type Student = UserMetadata & StudentMetadata & { studentId: number };

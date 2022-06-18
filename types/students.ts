import { Cohort } from "./cohorts";
import { Project } from "./projects";
import { UserMetadata } from "./users";

export type StudentMetadata = {
  cohortYear: Cohort["academicYear"];
  projectId: Project["id"];
  nusnetId: string;
  matricNo: string;
};

export type Student = UserMetadata & StudentMetadata & { studentId: number };

import { Cohort } from "./cohorts";
import { Project } from "./projects";

export interface User {
  id: number;
  name: string;
  email: string;
  profilePicUrl?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  personalSiteUrl?: string;
  selfIntro?: string;
  student?: Student;
  adviser?: Adviser;
  mentor?: Mentor;
  administrator?: Administator;
  facilitator?: Facilitator;
}

export interface Student {
  id: number;
  cohortYear: Cohort["academicYear"];
  projectId: Project["id"];
  nusnetId: string;
  matricNo: string;
}

export interface Adviser {
  id: number;
  cohortYear: Cohort["academicYear"];
  projectIds: Project["id"][];
  nusnetId: string;
  matricNo: string;
}

export interface Mentor {
  id: number;
  cohortYear: Cohort["academicYear"];
  projectIds: Project["id"][];
}

export interface Administator {
  id: number;
  startDate: string;
  endDate: string;
}
export interface Facilitator {
  id: number;
  cohortYear: Cohort["academicYear"];
}

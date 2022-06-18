import { Cohort } from "./cohorts";
import { Project } from "./projects";
import { UserMetadata } from "./users";

export type MentorMetadata = {
  cohortYear: Cohort["academicYear"];
  projectIds: Project["id"][];
};

export type Mentor = UserMetadata & MentorMetadata & { mentorId: number };

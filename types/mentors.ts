import { Cohort } from "./cohorts";
import { Team } from "./teams";
import { UserMetadata } from "./users";

export type MentorMetadata = {
  cohortYear: Cohort["academicYear"];
  teamIds: Team["id"][];
};

export type Mentor = UserMetadata & MentorMetadata & { mentorId: number };

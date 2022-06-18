import { Adviser } from "./advisers";
import { Cohort } from "./cohorts";
import { Mentor } from "./mentors";
import { Student } from "./students";

export enum LEVELS_OF_ACHIEVEMENT {
  ARTEMIS = "Artemis",
  APOLLO = "Apollo",
  GEMINI = "Gemini",
  VOSTOK = "Vostok",
}

export type Project = {
  id: number;
  name: string;
  posterUrl: string;
  students: Student[];
  adviser: Adviser;
  mentor?: Mentor;
  achievement: LEVELS_OF_ACHIEVEMENT;
  cohortYear: Cohort["academicYear"];
};

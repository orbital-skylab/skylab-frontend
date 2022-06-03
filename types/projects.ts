import { COHORTS } from "./cohorts";
import { Adviser, Mentor, Student } from "./users";

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
  adviser?: Adviser;
  adviserId?: number;
  mentor?: Mentor;
  mentorId?: number;
  achievement: LEVELS_OF_ACHIEVEMENT;
  cohortYear: COHORTS;
};

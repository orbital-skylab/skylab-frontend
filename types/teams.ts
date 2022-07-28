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

export enum LEVELS_OF_ACHIEVEMENT_WITH_ALL {
  ALL = "All",
  ARTEMIS = "Artemis",
  APOLLO = "Apollo",
  GEMINI = "Gemini",
  VOSTOK = "Vostok",
}

export type Team = {
  id: number;
  name: string;
  projectName: string;
  proposalPdf: string;
  videoUrl: string;
  posterUrl: string;
  students: Student[];
  adviser?: Adviser;
  mentor?: Mentor;
  achievement: LEVELS_OF_ACHIEVEMENT;
  cohortYear: Cohort["academicYear"];
  hasDropped: boolean;
};

export type LeanTeam = Pick<Team, "id" | "name">;

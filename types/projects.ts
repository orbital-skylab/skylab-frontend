import { Adviser, Mentor, Student } from "./users";

export enum LEVELS_OF_ACHIEVEMENT {
  ARTEMIS = "Artemis",
  APOLLO = "Apollo",
  GEMINI = "Gemini",
  VOSTOK = "Vostok",
}

export enum COHORTS {
  CURRENT = 2022,
  PREVIOUS = 2021,
}

export type Project = {
  id: number;
  name: string;
  posterUrl: string;
  students: Student[];
  adviser?: Adviser;
  mentor?: Mentor;
  achievement: LEVELS_OF_ACHIEVEMENT;
  cohortId: number;
};

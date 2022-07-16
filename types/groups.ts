import { Project } from "./projects";

export type EvaluationGroup = {
  groupId: number;
  projects: Project[];
  adviserId: number;
};

import { Adviser } from "./advisers";
import { Project } from "./projects";

export type EvaluationRelation = {
  id: number;
  fromProjectId: number;
  toProjectId: number;
  fromProject?: Project;
  toProject?: Project;
  adviser: Adviser;
};

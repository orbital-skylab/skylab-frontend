import { Project } from "./projects";

export type EvaluationRelation = {
  id: number;
  fromProjectId: number;
  toProjectId: number;
  fromProject?: Project;
  toProject?: Project;
};

export type LeanEvaluationRelation = Omit<
  EvaluationRelation,
  "fromProject" | "toProject"
>;

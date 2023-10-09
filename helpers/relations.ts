import { Project } from "@/types/projects";
import { EvaluationRelation } from "@/types/relations";

/**
 * Constants
 */
// The mininum number of teams any team should be evaluating
export const NUMBER_OF_EVALUATIONS_PER_TEAM = 3;

/**
 * Generate a list of relations based on a list of projects in a round robin fashion.
 * e.g. there are 5 projects (A, B, C, D, E) and each project must evaluate 2 other projects
 * The following relations will be generated
 * A -> B, A -> C,
 * B -> C, B -> D,
 * C -> D, C -> E,
 * D -> E, D -> A,
 * E -> A, E -> B
 */
export const generateRoundRobinRelations = (
  projects: Project[]
): Partial<EvaluationRelation>[] => {
  const relations: Partial<EvaluationRelation>[] = [];
  const numberOfProjects = projects.length;

  const numberOfEvaluations = Math.min(
    numberOfProjects - 1,
    NUMBER_OF_EVALUATIONS_PER_TEAM
  );

  for (let i = 0; i < numberOfProjects; i++) {
    for (let j = 1; j <= numberOfEvaluations; j++) {
      const fromProject = projects[i];
      const toProject = projects[(i + j) % numberOfProjects];
      relations.push({
        fromProject,
        toProject,
        fromProjectId: fromProject.id,
        toProjectId: toProject.id,
      });
    }
  }

  return relations;
};

export const generateGroupRelations = (
  projects: Project[]
): Partial<EvaluationRelation>[] => {
  const relations: Partial<EvaluationRelation>[] = [];
  const numberOfProjects = projects.length;

  for (let i = 0; i < numberOfProjects; i++) {
    for (let j = 0; j < numberOfProjects; j++) {
      if (i === j) {
        continue;
      }
      const fromProject = projects[i];
      const toProject = projects[j];
      relations.push({
        fromProject,
        toProject,
        fromProjectId: fromProject.id,
        toProjectId: toProject.id,
      });
    }
  }

  return relations;
};

export const groupRelationsByTeam = (relations: EvaluationRelation[]) => {
  const groupedRelations: Record<
    number,
    {
      team: Project;
      evaluatees: Project[];
      evaluators: Project[];
    }
  > = {};

  relations.forEach((relation) => {
    const { fromProject, toProject } = relation;

    if (!fromProject || !toProject) return;

    if (!groupedRelations[fromProject.id]) {
      groupedRelations[fromProject.id] = {
        team: fromProject,
        evaluatees: [],
        evaluators: [],
      };
    }

    if (!groupedRelations[toProject.id]) {
      groupedRelations[toProject.id] = {
        team: toProject,
        evaluatees: [],
        evaluators: [],
      };
    }

    groupedRelations[fromProject.id].evaluatees.push(toProject);
    groupedRelations[toProject.id].evaluators.push(fromProject);
  });

  return groupedRelations;
};

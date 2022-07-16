import { Project } from "@/types/projects";

/**
 * Categorizes projects into groups based on their group ID.
 * If a project does not have a group ID (no group), the project is discarded.
 * @param projects Projects to categorize
 * @returns A map where the key is the group ID and the value is a set of the projects
 */
export const groupProjectsByGroupId = (
  projects?: Project[]
): Map<number, Set<Project>> => {
  if (!projects || !projects.length) {
    return new Map();
  }

  const map = new Map<number, Set<Project>>();
  projects.forEach((project) => {
    const groupId = project.groupId;
    if (groupId) {
      if (!map.has(groupId)) {
        map.set(groupId, new Set());
      }
      map.get(groupId)?.add(project);
    }
  });

  return map;
};

import { Submission } from "@/types/submissions";
import { User } from "@/types/users";

export const isSubmissionsFromProjectOrUser = (
  submission: Submission | undefined,
  user: User | undefined
) => {
  if (!submission || !user) {
    return false;
  }

  // Submitter is a project
  if (submission.fromProject) {
    return user.student?.projectId === submission.fromProject.id;
  }
  // Submitter is a user
  if (submission.fromUser) {
    return user.id === submission.fromUser.id;
  }

  return false;
};

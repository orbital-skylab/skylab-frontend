import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { Project } from "@/types/projects";
import type { NextPage } from "next";
import { useRouter } from "next/router";

export type GetProjectResponse = {
  project: Project;
};

const ProjectDetails: NextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;

  const { data: getProjectData, status: getProjectStatus } =
    useFetch<GetProjectResponse>({
      endpoint: `/projects/${projectId}`,
    });

  return (
    <Body
      isLoading={isFetching(getProjectStatus)}
      loadingText="Loading project..."
    >
      <NoDataWrapper
        noDataCondition={!getProjectData || !getProjectData.project}
        fallback={
          <NoneFound
            showReturnHome
            message="There is no such project with that project ID"
          />
        }
      >
        {projectId}
      </NoDataWrapper>
    </Body>
  );
};
export default ProjectDetails;

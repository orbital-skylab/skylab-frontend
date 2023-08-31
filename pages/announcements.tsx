import type { NextPage } from "next";
import Body from "@/components/layout/Body";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { GetAnnouncementsResponse } from "@/types/api";
import { TargetAudienceRole } from "@/types/announcements";
import { useState } from "react";
import useCohort from "@/contexts/useCohort";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";

const Announcements: NextPage = () => {
  const { currentCohortYear } = useCohort();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedTargetAudienceRole, setSelectedTargetAudienceRole] =
    useState<TargetAudienceRole>("All");

  const { data: announcementsResponse, status: announcementsStatus } =
    useFetch<GetAnnouncementsResponse>({
      endpoint: `/announcements?cohortYear=${currentCohortYear}&targetAudienceRole=${selectedTargetAudienceRole}`,
    });

  return (
    <Body isLoading={isFetching(announcementsStatus)}>
      <NoDataWrapper
        noDataCondition={
          !announcementsResponse?.announcements ||
          !announcementsResponse?.announcements.length
        }
        fallback={<div>No announcements found</div>}
      >
        {announcementsResponse?.announcements.map((announcement) => (
          <div key={announcement.id}>yo</div>
        ))}
      </NoDataWrapper>
    </Body>
  );
};

export default Announcements;

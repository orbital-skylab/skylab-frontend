import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import VoteEventEdit from "@/components/tabs/voteEvent/VoteEventEdit";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { GetVoteEventResponse } from "@/types/api";
import { ROLES } from "@/types/roles";
import { NextPage } from "next";
import { useRouter } from "next/router";

const EditVoteEvent: NextPage = () => {
  const router = useRouter();
  const { voteEventId } = router.query;

  const { data, status, mutate } = useFetch<GetVoteEventResponse>({
    endpoint: `/vote-events/${voteEventId}`,
    enabled: !!voteEventId,
  });

  return (
    <Body
      isLoading={isFetching(status)}
      loadingText="Loading edit vote event..."
      authorizedRoles={[ROLES.ADMINISTRATORS]}
    >
      <NoDataWrapper
        noDataCondition={data === undefined}
        fallback={<NoneFound message="No such vote event found" />}
      >
        {data && <VoteEventEdit voteEvent={data.voteEvent} mutate={mutate} />}
      </NoDataWrapper>
    </Body>
  );
};

export default EditVoteEvent;

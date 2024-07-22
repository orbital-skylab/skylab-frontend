import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import ResultsTable from "@/components/tables/ResultsTable";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { getVoteEventStatus } from "@/helpers/voteEvent";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { GetVoteEventResponse, GetVoteEventResultsResponse } from "@/types/api";
import { VOTE_EVENT_STATUS } from "@/types/voteEvents";
import { Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";

const ResultsPage: NextPage = () => {
  const router = useRouter();
  const { voteEventId } = router.query;

  const { data: voteEventData, status: fetchVoteEventStatus } =
    useFetch<GetVoteEventResponse>({
      endpoint: `/vote-events/${voteEventId}`,
      enabled: !!voteEventId,
    });

  const { data: resultsData, status: fetchResultsStatus } =
    useFetch<GetVoteEventResultsResponse>({
      endpoint: `/vote-events/${voteEventId}/results`,
      enabled: !!voteEventId,
    });

  const voteEventStatus =
    voteEventData && getVoteEventStatus(voteEventData.voteEvent);
  const hasVoteEventStarted =
    voteEventStatus === VOTE_EVENT_STATUS.IN_PROGRESS ||
    voteEventStatus === VOTE_EVENT_STATUS.COMPLETED;
  const areResultsAvailable =
    voteEventData && voteEventData.voteEvent.resultsFilter.areResultsPublished;

  return (
    <Body
      isLoading={
        isFetching(fetchVoteEventStatus) && isFetching(fetchResultsStatus)
      }
      loadingText="Loading results..."
    >
      <NoDataWrapper
        noDataCondition={typeof voteEventId !== "string" || !voteEventData}
        fallback={<NoneFound title="No such vote event found!" message="" />}
      >
        <NoDataWrapper
          noDataCondition={!hasVoteEventStarted}
          fallback={
            <NoneFound title="Vote event has not started!" message="" />
          }
        >
          <NoDataWrapper
            noDataCondition={!areResultsAvailable}
            fallback={<NoneFound title="Results Not published!" message="" />}
          >
            <Typography align="center" variant="h4" id="results-header">
              {voteEventData?.voteEvent.title}
            </Typography>
            <ResultsTable
              results={resultsData?.results || []}
              status={fetchResultsStatus}
            />
          </NoDataWrapper>
        </NoDataWrapper>
      </NoDataWrapper>
    </Body>
  );
};
export default ResultsPage;

import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import AddVoteEventModal from "@/components/modals/AddVoteEventModal/AddVoteEventModal";
import VoteEventTable from "@/components/tables/VoteEventTable";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { PAGES } from "@/helpers/navigation";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { GetVoteEventsResponse } from "@/types/api";
import { Add } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import { NextPage } from "next";
import { useState } from "react";

const VoteEvents: NextPage = () => {
  const [isAddVoteEventOpen, setIsAddVoteEventOpen] = useState(false);
  const { data, status, mutate } = useFetch<GetVoteEventsResponse>({
    endpoint: PAGES.VOTE_EVENTS,
  });

  const handleOpenAddVoteEventModal = () => {
    setIsAddVoteEventOpen(true);
  };

  return (
    <>
      <AddVoteEventModal
        open={isAddVoteEventOpen}
        setOpen={setIsAddVoteEventOpen}
        mutate={mutate}
      />
      <Body>
        <Stack direction="row" justifyContent="end" spacing="0.5rem">
          <Button
            id="add-vote-event-modal-button"
            variant="outlined"
            size="small"
            onClick={handleOpenAddVoteEventModal}
          >
            <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
            New Vote Event
          </Button>
        </Stack>
        <LoadingWrapper
          isLoading={isFetching(status)}
          loadingText="Loading vote events..."
          fullScreen
        >
          <NoDataWrapper
            noDataCondition={Boolean(
              (data && data.voteEvents === undefined) ||
                data?.voteEvents.length === 0
            )}
            fallback={<NoneFound title="" message="No vote events found" />}
          >
            {data && (
              <VoteEventTable voteEvents={data.voteEvents} mutate={mutate} />
            )}
          </NoDataWrapper>
        </LoadingWrapper>
      </Body>
    </>
  );
};
export default VoteEvents;

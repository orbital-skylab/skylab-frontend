import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import SubmitVotesModal from "@/components/modals/SubmitVotesModal";
import VoteCandidateTable from "@/components/tables/VoteCandidateTable";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { shuffleArray } from "@/helpers/array";
import { getVoteEventStatus } from "@/helpers/voteEvent";
import useFetch, { FETCH_STATUS, isFetching } from "@/hooks/useFetch";
import {
  GetCandidatesResponse,
  GetVoteEventResponse,
  GetVotesResponse,
} from "@/types/api";
import { Project } from "@/types/projects";
import { VOTE_EVENT_STATUS } from "@/types/voteEvents";
import { Button, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

const candidateDisplayFactory = {
  generateItems: (
    candidates: Project[],
    selectedCandidates: { [key: number]: boolean },
    status: FETCH_STATUS,
    setSelectedCandidates: Dispatch<
      SetStateAction<{
        [key: number]: boolean;
      }>
    >
  ) => {
    return (
      <VoteCandidateTable
        selectedCandidates={selectedCandidates}
        candidates={candidates}
        status={status}
        setSelectedCandidates={setSelectedCandidates}
      />
    );
  },
};

const VotingPage: NextPage = () => {
  const router = useRouter();
  const { voteEventId } = router.query;
  const [selectedCandidates, setSelectedCandidates] = useState<{
    [key: number]: boolean;
  }>({});
  const [openSubmitVotesModal, setOpenSubmitVotesModal] = useState(false);

  const voteCount = Object.values(selectedCandidates).filter(Boolean).length;

  const { data: voteEventData, status: fetchVoteEventStatus } =
    useFetch<GetVoteEventResponse>({
      endpoint: `/vote-events/${voteEventId}`,
      enabled: !!voteEventId,
    });

  const {
    data: votesData,
    status: fetchVotesStatus,
    mutate: mutateVotes,
  } = useFetch<GetVotesResponse>({
    endpoint: `/vote-events/${voteEventId}/votes`,
    enabled: !!voteEventId,
    onFetch: (data) => {
      const selectedCandidates = data.votes.reduce((acc, vote) => {
        acc[vote.projectId] = true;
        return acc;
      }, {} as { [key: number]: boolean });

      setSelectedCandidates(selectedCandidates);
    },
  });

  const { data: candidatesData, status: fetchcandidatesStatus } =
    useFetch<GetCandidatesResponse>({
      endpoint: `/vote-events/${voteEventId}/candidates`,
      enabled: !!voteEventId,
    });

  const handleOpenSubmitVotesModal = () => {
    setOpenSubmitVotesModal(true);
  };

  const votes = votesData?.votes;
  const voteConfig = voteEventData?.voteEvent.voteConfig;
  const alreadyVoted = votes && votes.length > 0;
  const isVoteEventNotOpen =
    voteEventData &&
    getVoteEventStatus(voteEventData.voteEvent) !==
      VOTE_EVENT_STATUS.IN_PROGRESS;

  const candidates = useMemo(() => {
    if (!voteConfig) {
      return [];
    }

    const candidatesArray = candidatesData?.candidates || [];

    return voteConfig.isRandomOrder
      ? shuffleArray(candidatesArray)
      : candidatesArray;
  }, [candidatesData, voteConfig]);

  return (
    <Body
      isLoading={
        isFetching(fetchVoteEventStatus) && isFetching(fetchVotesStatus)
      }
      loadingText="Loading vote event..."
    >
      <NoDataWrapper
        noDataCondition={!voteEventData}
        fallback={<NoneFound title="No such vote event found!" message="" />}
      >
        <NoDataWrapper
          noDataCondition={
            isVoteEventNotOpen === undefined || isVoteEventNotOpen
          }
          fallback={<NoneFound title="Vote event is not open!" message="" />}
        >
          <Typography id="vote-event-title" align="center" variant="h4">
            {voteEventData?.voteEvent.title}
          </Typography>
          {alreadyVoted ? (
            <Stack spacing={1}>
              <Typography
                align="center"
                variant="h6"
                sx={{ marginTop: "1rem" }}
              >
                Votes Submitted
              </Typography>
              <Typography align="center">
                You have voted for the following project IDs:
              </Typography>
              <Typography align="center">
                {votes.map((vote) => vote.projectId).join(", ")}
              </Typography>
            </Stack>
          ) : (
            <>
              <SubmitVotesModal
                voteEventId={parseInt(voteEventId as string)}
                selectedCandidates={selectedCandidates}
                open={openSubmitVotesModal}
                setOpen={setOpenSubmitVotesModal}
                mutate={mutateVotes}
              />
              <Typography sx={{ marginY: "2rem" }}>
                {voteConfig?.instructions || ""}
              </Typography>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6">
                  Vote for a maximum of {voteConfig?.maxVotes}, and minimum of{" "}
                  {voteConfig?.minVotes} projects.
                </Typography>
                <Typography variant="h6">Votes cast: {voteCount}</Typography>
              </Stack>
              {candidateDisplayFactory.generateItems(
                candidates,
                selectedCandidates,
                fetchcandidatesStatus,
                setSelectedCandidates
              )}
              <Stack>
                <Button
                  id="submit-votes-modal-button"
                  onClick={handleOpenSubmitVotesModal}
                  variant="contained"
                  color="secondary"
                  disabled={
                    !voteConfig ||
                    voteCount < voteConfig.minVotes ||
                    voteCount > voteConfig.maxVotes
                  }
                  sx={{
                    position: "fixed",
                    bottom: "2rem",
                    right: "2rem",
                  }}
                >
                  Submit
                </Button>
              </Stack>
            </>
          )}
        </NoDataWrapper>
      </NoDataWrapper>
    </Body>
  );
};
export default VotingPage;

import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import SubmitVotesModal from "@/components/modals/SubmitVotesModal";
import VoteCandidateTable from "@/components/tables/VoteCandidateTable";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { shuffleArray } from "@/helpers/array";
import useFetch, { FETCH_STATUS, isFetching } from "@/hooks/useFetch";
import {
  GetCandidatesResponse,
  GetVoteEventResponse,
  GetVotesResponse,
} from "@/types/api";
import { Project } from "@/types/projects";
import { VoteConfig } from "@/types/voteEvents";
import { Button, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";

const candidateDisplayFactory = {
  generateItems: (
    candidatesData: Project[],
    selectedCandidates: { [key: number]: boolean },
    voteConfig: VoteConfig | undefined,
    status: FETCH_STATUS,
    setSelectedCandidates: Dispatch<
      SetStateAction<{
        [key: number]: boolean;
      }>
    >
  ) => {
    if (!voteConfig) {
      return null;
    }

    const candidates = voteConfig.isRandomOrder
      ? shuffleArray(candidatesData)
      : candidatesData;

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
    });

  const {
    data: votesData,
    status: fetchVotesStatus,
    mutate: mutateVotes,
  } = useFetch<GetVotesResponse>({
    endpoint: `/vote-events/${voteEventId}/votes`,
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
    });

  const handleOpenSubmitVotesModal = () => {
    setOpenSubmitVotesModal(true);
  };

  const votes = votesData?.votes;
  const voteConfig = voteEventData?.voteEvent.voteConfig;
  const alreadyVoted = votes && votes.length > 0;

  if (typeof voteEventId !== "string") {
    return <NoneFound message="Invalid vote event ID" />;
  }

  return (
    <Body
      isLoading={
        isFetching(fetchVoteEventStatus) && isFetching(fetchVotesStatus)
      }
      loadingText="Loading vote event..."
    >
      <NoDataWrapper
        noDataCondition={!voteEventData}
        fallback={<NoneFound message="No such vote event found" />}
      >
        <Typography align="center" variant="h2">
          {voteEventData?.voteEvent.title}
        </Typography>
        {alreadyVoted ? (
          <Stack spacing={1}>
            <Typography align="center" variant="h3">
              Votes Submitted
            </Typography>
            <Typography align="center">
              You have voted for the following project IDs
            </Typography>
            <Typography align="center">
              {votes.map((vote) => vote.projectId).join(", ")}
            </Typography>
          </Stack>
        ) : (
          <>
            <SubmitVotesModal
              voteEventId={parseInt(voteEventId)}
              selectedCandidates={selectedCandidates}
              open={openSubmitVotesModal}
              setOpen={setOpenSubmitVotesModal}
              mutate={mutateVotes}
            />
            <Typography variant="h3">
              {voteConfig?.instructions || ""}
            </Typography>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h4">
                Vote for a maximum of {voteConfig?.maxVotes} and minimum of{" "}
                {voteConfig?.minVotes} candidates.
              </Typography>
              <Typography variant="h4">Votes cast: {voteCount}</Typography>
            </Stack>
            {candidateDisplayFactory.generateItems(
              candidatesData?.candidates || [],
              selectedCandidates,
              voteConfig,
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
              >
                Submit
              </Button>
            </Stack>
          </>
        )}
      </NoDataWrapper>
    </Body>
  );
};
export default VotingPage;

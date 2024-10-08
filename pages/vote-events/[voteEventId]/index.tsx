import GoBackButton from "@/components/buttons/GoBackButton";
import { CandidateDisplayFactory } from "@/components/candidateDisplays/CandidateDisplayFactory";
import NoneFound from "@/components/emptyStates/NoneFound";
import Body from "@/components/layout/Body";
import SubmitVotesModal from "@/components/modals/SubmitVotesModal";
import SearchInput from "@/components/search/SearchInput";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { shuffleArray } from "@/helpers/array";
import { getVoteEventStatus } from "@/helpers/voteEvent";
import useFetch, { isFetching } from "@/hooks/useFetch";
import {
  GetCandidatesResponse,
  GetVoteEventResponse,
  GetVotesResponse,
} from "@/types/api";
import { DISPLAY_TYPES, VOTE_EVENT_STATUS } from "@/types/voteEvents";
import { Button, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const VotingPage: NextPage = () => {
  const router = useRouter();
  const { voteEventId } = router.query;
  const [selectedCandidates, setSelectedCandidates] = useState<{
    [key: number]: boolean;
  }>({});
  const [openSubmitVotesModal, setOpenSubmitVotesModal] = useState(false);
  const [searchText, setSearchText] = useState("");

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

  const handleSearchChange = (searchText: string) => {
    setSearchText(searchText);
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
      : candidatesArray.sort((a, b) => a.id - b.id);
  }, [candidatesData, voteConfig]);

  const filteredCandidates = candidates.filter(
    (candidate) =>
      candidate.name.toLowerCase().includes(searchText.toLowerCase()) ||
      candidate.id.toString().includes(searchText)
  );

  return (
    <Body
      isLoading={
        isFetching(fetchVoteEventStatus) && isFetching(fetchVotesStatus)
      }
      loadingText="Loading vote event..."
    >
      <GoBackButton id="go-back-button" />
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
          <NoDataWrapper
            noDataCondition={voteConfig === undefined}
            fallback={
              <NoneFound title="Vote event config not set!" message="" />
            }
          >
            <Typography
              id="vote-event-title"
              align="center"
              variant="h4"
              sx={{ fontSize: { xs: "1.5rem", sm: "2rem" } }}
            >
              {voteEventData?.voteEvent.title}
            </Typography>
            {alreadyVoted ? (
              <Stack spacing={1}>
                <Typography
                  align="center"
                  variant="h6"
                  sx={{
                    marginTop: "1rem",
                    fontSize: { xs: "1rem", sm: "1.5rem" },
                  }}
                >
                  Votes Submitted
                </Typography>
                <Typography
                  align="center"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  You have voted for the following project IDs:
                </Typography>
                <Typography
                  align="center"
                  sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}
                >
                  {votes.map((vote) => vote.projectId).join(", ")}
                </Typography>
                {voteEventData?.voteEvent.resultsFilter.areResultsPublished && (
                  <Button
                    id="view-results-button"
                    onClick={() =>
                      router.push(`/vote-events/${voteEventId}/results`)
                    }
                    variant="contained"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      width: "auto",
                      alignSelf: "center",
                    }}
                  >
                    View Results
                  </Button>
                )}
              </Stack>
            ) : (
              <>
                <SubmitVotesModal
                  voteEventId={parseInt(voteEventId as string)}
                  selectedCandidates={selectedCandidates}
                  open={openSubmitVotesModal}
                  setOpen={setOpenSubmitVotesModal}
                  candidates={candidates}
                  mutate={mutateVotes}
                />
                <Typography
                  sx={{
                    marginY: "1rem",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  }}
                >
                  {voteConfig?.instructions || ""}
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  marginBottom={2}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: { xs: "0.875rem", sm: "1rem" },
                      fontWeight: "bold",
                    }}
                  >
                    Vote for a maximum of {voteConfig?.maxVotes}, and minimum of{" "}
                    {voteConfig?.minVotes} projects.
                  </Typography>
                </Stack>
                {voteConfig?.displayType !== DISPLAY_TYPES.NONE && (
                  <SearchInput
                    id="search-candidates"
                    label="Search name or ID"
                    onChange={handleSearchChange}
                  />
                )}
                {voteConfig &&
                  CandidateDisplayFactory.generateItems({
                    candidates: filteredCandidates,
                    selectedCandidates,
                    status: fetchcandidatesStatus,
                    setSelectedCandidates,
                    isDisabled: voteCount >= voteConfig.maxVotes,
                    voteConfig,
                  })}
                {voteConfig && (
                  <Stack spacing={2}>
                    <Button
                      id="submit-votes-modal-button"
                      onClick={handleOpenSubmitVotesModal}
                      variant="contained"
                      color="secondary"
                      disabled={
                        voteCount < voteConfig.minVotes ||
                        voteCount > voteConfig.maxVotes
                      }
                      sx={{
                        position: "fixed",
                        bottom: { xs: "1rem", sm: "2rem" },
                        right: { xs: "1rem", sm: "2rem" },
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      }}
                    >
                      {voteCount < voteConfig.minVotes
                        ? `Votes: ${voteCount}/${voteConfig.maxVotes} (Minimum: ${voteConfig.minVotes} Required)`
                        : `Submit Votes: ${voteCount}/${voteConfig.maxVotes} (Max: ${voteConfig.maxVotes} Allowed)`}
                    </Button>
                  </Stack>
                )}
              </>
            )}
          </NoDataWrapper>
        </NoDataWrapper>
      </NoDataWrapper>
    </Body>
  );
};

export default VotingPage;

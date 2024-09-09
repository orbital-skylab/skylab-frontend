import NoneFound from "@/components/emptyStates/NoneFound";
import VotingForm from "@/components/forms/VotingForm";
import VotingGalleryGrid from "@/components/grids";
import Body from "@/components/layout/Body";
import SubmitVotesModal from "@/components/modals/SubmitVotesModal";
import SearchInput from "@/components/search/SearchInput";
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
import {
  DISPLAY_TYPES,
  VOTE_EVENT_STATUS,
  VoteEvent,
} from "@/types/voteEvents";
import { Button, Stack, Typography } from "@mui/material";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

const candidateDisplayFactory = {
  generateItems: (
    voteConfig: VoteEvent["voteConfig"],
    candidates: Project[],
    selectedCandidates: { [key: number]: boolean },
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

    if (voteConfig.displayType === DISPLAY_TYPES.GALLERY) {
      return (
        <VotingGalleryGrid
          selectedCandidates={selectedCandidates}
          candidates={candidates}
          status={status}
          setSelectedCandidates={setSelectedCandidates}
        />
      );
    } else if (voteConfig.displayType === DISPLAY_TYPES.TABLE) {
      return (
        <VoteCandidateTable
          selectedCandidates={selectedCandidates}
          candidates={candidates}
          status={status}
          setSelectedCandidates={setSelectedCandidates}
        />
      );
    } else {
      return <VotingForm setSelectedCandidates={setSelectedCandidates} />;
    }
  },
};

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
      : candidatesArray;
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
                {voteConfig?.displayType !== DISPLAY_TYPES.NONE && (
                  <SearchInput
                    id="search-candidates"
                    label="Search name or ID"
                    onChange={handleSearchChange}
                  />
                )}
                {candidateDisplayFactory.generateItems(
                  voteConfig,
                  filteredCandidates,
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
      </NoDataWrapper>
    </Body>
  );
};
export default VotingPage;

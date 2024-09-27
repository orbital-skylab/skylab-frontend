import PublishResultsModal from "@/components/modals/PublishResultsModal";
import RoleWeightsModal from "@/components/modals/RoleWeightsModal";
import ResultsTable from "@/components/tables/ResultsTable";
import { getMostImportantRole } from "@/helpers/roles";
import useFetch, { Mutate } from "@/hooks/useFetch";
import { GetVoteEventResponse, GetVoteEventVotesResponse } from "@/types/api";
import { Project } from "@/types/projects";
import { ROLES } from "@/types/roles";
import {
  ResultsFilter,
  Vote,
  VoteEvent,
  VoteEventResult,
} from "@/types/voteEvents";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEvent: VoteEvent;
  mutate: Mutate<GetVoteEventResponse>;
};

const roleMap: { [key: string]: keyof ResultsFilter } = {
  [ROLES.ADMINISTRATORS]: "administratorWeight",
  [ROLES.MENTORS]: "mentorWeight",
  [ROLES.STUDENTS]: "studentWeight",
  [ROLES.ADVISERS]: "adviserWeight",
};

const calculateResults = (votes: Vote[], resultsFilter: ResultsFilter) => {
  let totalPoints = 0;
  const results = votes.reduce(
    (acc, vote) => {
      const { projectId, project, internalVoter } = vote;

      const pointsToAdd = internalVoter
        ? (resultsFilter[
            roleMap[getMostImportantRole(internalVoter)]
          ] as number)
        : (resultsFilter["publicWeight"] as number);

      totalPoints += pointsToAdd;

      if (acc[projectId]) {
        acc[projectId].votes++;
        acc[projectId].points += pointsToAdd;
      } else {
        acc[projectId] = {
          project,
          votes: 1,
          points: pointsToAdd,
        };
      }
      return acc;
    },
    {} as Record<
      number,
      {
        project: Project;
        votes: number;
        points: number;
      }
    >
  );

  const fullResults: VoteEventResult[] = Object.values(results)
    .sort((a, b) => b.points - a.points)
    .map((result, idx) => {
      return {
        ...result,
        rank: idx + 1,
        percentage: parseFloat(
          ((result.points / totalPoints) * 100).toFixed(2)
        ),
      };
    });

  return fullResults;
};

const ResultsTab: FC<Props> = ({ voteEvent, mutate }) => {
  const [openPublishResultsModal, setOpenPublishResultsModal] = useState(false);
  const [openRoleWeightsModal, setOpenRoleWeightsModal] = useState(false);

  const { data: votesData, status } = useFetch<GetVoteEventVotesResponse>({
    endpoint: `/vote-events/${voteEvent.id}/votes/all`,
    enabled: !!voteEvent.id,
  });

  const results = calculateResults(
    votesData?.votes || [],
    voteEvent.resultsFilter
  );

  return (
    <>
      <PublishResultsModal
        voteEvent={voteEvent}
        open={openPublishResultsModal}
        setOpen={setOpenPublishResultsModal}
        mutate={mutate}
      />
      <RoleWeightsModal
        voteEvent={voteEvent}
        open={openRoleWeightsModal}
        setOpen={setOpenRoleWeightsModal}
        mutate={mutate}
      />
      <Stack flexGrow={1} spacing={2}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} md={4} textAlign="center" order={{ xs: 1, md: 2 }}>
            <Typography variant="h5" id="results-header">
              Results
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            display="flex"
            justifyContent={{ xs: "center", md: "flex-start" }}
            order={{ xs: 2, md: 1 }}
          >
            <Button
              id="role-weights-modal-button"
              variant="contained"
              onClick={() => setOpenRoleWeightsModal(true)}
            >
              Role Weights
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            md={4}
            display="flex"
            justifyContent={{ xs: "center", md: "flex-end" }}
            order={{ xs: 3, md: 3 }}
          >
            <Button
              id="publish-results-modal-button"
              variant="contained"
              onClick={() => setOpenPublishResultsModal(true)}
            >
              {voteEvent.resultsFilter.areResultsPublished
                ? "Unpublish Results"
                : "Publish Results"}
            </Button>
          </Grid>
        </Grid>

        <ResultsTable results={results} status={status} />
      </Stack>
    </>
  );
};

export default ResultsTab;

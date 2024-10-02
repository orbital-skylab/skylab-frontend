import DeleteVoteEventModal from "@/components/modals/DeleteVoteEventModal";
import RegisterForVoteEventModal from "@/components/modals/RegisterForVoteEventModal";
import useAuth from "@/contexts/useAuth";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { userHasRole } from "@/helpers/roles";
import {
  checkIfRegistrationIsOpen,
  getVoteEventStatus,
} from "@/helpers/voteEvent";
import { Mutate } from "@/hooks/useFetch";
import { BASE_TRANSITION } from "@/styles/constants";
import { GetVoteEventsResponse } from "@/types/api";
import { ROLES } from "@/types/roles";
import { VOTE_EVENT_STATUS, VoteEvent } from "@/types/voteEvents";
import {
  Button,
  Chip,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import Link from "next/link";
import { FC, useState } from "react";

type Props = {
  voteEvent: VoteEvent;
  mutate: Mutate<GetVoteEventsResponse>;
};

const statusColorMap = {
  [VOTE_EVENT_STATUS.INCOMPLETE]: "#FFEB3B",
  [VOTE_EVENT_STATUS.UPCOMING]: "#2196F3",
  [VOTE_EVENT_STATUS.IN_PROGRESS]: "#4CAF50",
  [VOTE_EVENT_STATUS.COMPLETED]: "#9E9E9E",
};

const getStatusInfo = (voteEvent: VoteEvent) => {
  const status = getVoteEventStatus(voteEvent);

  if (status === VOTE_EVENT_STATUS.INCOMPLETE) {
    return `
    ${!voteEvent.voterManagement ? "Voter management not set." : ""} 
    ${!voteEvent.voteConfig ? "Vote config not set." : ""}`;
  } else if (status === VOTE_EVENT_STATUS.UPCOMING) {
    return "Event has not started yet.";
  } else if (status === VOTE_EVENT_STATUS.IN_PROGRESS) {
    return "Event is in progress.";
  } else {
    return "Event has ended.";
  }
};

const VoteEventRow: FC<Props> = ({ voteEvent, mutate }) => {
  const [isDeleteVoteEventOpen, setIsDeleteVoteEventOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { user } = useAuth();

  const voteEventStatus = getVoteEventStatus(voteEvent);
  const statusColor = statusColorMap[voteEventStatus];
  const voterManagement = voteEvent.voterManagement;

  const isRegistrationOpen =
    voterManagement && checkIfRegistrationIsOpen(voterManagement);
  const areResultsPublished =
    voteEvent.resultsFilter?.areResultsPublished ?? false;
  const isVotingInProgress = voteEventStatus === VOTE_EVENT_STATUS.IN_PROGRESS;
  const hasVoteEventStarted =
    isVotingInProgress || voteEventStatus === VOTE_EVENT_STATUS.COMPLETED;
  const hasVoteEventEnded = voteEventStatus === VOTE_EVENT_STATUS.COMPLETED;

  const showRegisterButton = isRegistrationOpen && !hasVoteEventEnded;
  const showVoteButton = isVotingInProgress && !isRegistrationOpen;
  const showResultsButton =
    areResultsPublished && hasVoteEventStarted && !isRegistrationOpen;
  const showEditButton = userHasRole(user, ROLES.ADMINISTRATORS);
  const showDeleteButton = showEditButton;

  const handleOpenRegisterModal = () => {
    setIsRegistering(true);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteVoteEventOpen(true);
  };

  return (
    <>
      <RegisterForVoteEventModal
        voteEvent={voteEvent}
        open={isRegistering}
        setOpen={setIsRegistering}
        mutate={mutate}
      />
      <DeleteVoteEventModal
        voteEvent={voteEvent}
        open={isDeleteVoteEventOpen}
        setOpen={setIsDeleteVoteEventOpen}
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{voteEvent.title}</TableCell>
        <TableCell>
          {isoDateToLocaleDateWithTime(voteEvent.startTime)}
        </TableCell>
        <TableCell>{isoDateToLocaleDateWithTime(voteEvent.endTime)}</TableCell>
        <TableCell>
          <Tooltip title={getStatusInfo(voteEvent)} placement="top">
            <Chip
              label={voteEventStatus}
              sx={{
                backgroundColor: statusColor,
              }}
            />
          </Tooltip>
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            {showRegisterButton && (
              <Tooltip title="Register for this event" placement="top">
                <Button
                  id={`register-vote-event-${voteEvent.id}-button`}
                  onClick={handleOpenRegisterModal}
                >
                  Register
                </Button>
              </Tooltip>
            )}
            {showVoteButton && (
              <Link href={`/vote-events/${voteEvent.id}`} passHref>
                <Tooltip title="Vote in this event" placement="top">
                  <Button id={`vote-event-${voteEvent.id}-vote-button`}>
                    Vote
                  </Button>
                </Tooltip>
              </Link>
            )}
            {showResultsButton && (
              <Link href={`/vote-events/${voteEvent.id}/results`} passHref>
                <Tooltip title="View results" placement="top">
                  <Button id={`vote-event-${voteEvent.id}-results-button`}>
                    Results
                  </Button>
                </Tooltip>
              </Link>
            )}
            {showEditButton && (
              <Link href={`/vote-events/${voteEvent.id}/edit`} passHref>
                <Tooltip title="Edit vote event" placement="top">
                  <Button id={`edit-vote-event-${voteEvent.id}-button`}>
                    Edit
                  </Button>
                </Tooltip>
              </Link>
            )}
            {showDeleteButton && (
              <Tooltip title="Delete the vote event" placement="top">
                <Button
                  id={`delete-vote-event-${voteEvent.id}-button`}
                  onClick={handleOpenDeleteModal}
                  sx={{
                    transition: BASE_TRANSITION,
                    "&:hover": {
                      backgroundColor: "error.main",
                      color: "white",
                    },
                  }}
                >
                  Delete
                </Button>
              </Tooltip>
            )}
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};
export default VoteEventRow;

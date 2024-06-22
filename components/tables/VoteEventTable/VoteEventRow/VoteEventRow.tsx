import DeleteVoteEventModal from "@/components/modals/DeleteVoteEventModal";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { getVoteEventStatus } from "@/helpers/voteEvent";
import { Mutate } from "@/hooks/useFetch";
import { BASE_TRANSITION } from "@/styles/constants";
import { GetVoteEventsResponse } from "@/types/api";
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

const VoteEventRow: FC<Props> = ({ voteEvent, mutate }) => {
  const [isDeleteVoteEventOpen, setIsDeleteVoteEventOpen] = useState(false);

  const status = getVoteEventStatus(voteEvent);
  const statusColor = statusColorMap[status];

  const handleOpenDeleteModal = () => {
    setIsDeleteVoteEventOpen(true);
  };

  return (
    <>
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
          <Chip
            label={status}
            sx={{
              backgroundColor: statusColor,
            }}
          />
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            {status === VOTE_EVENT_STATUS.INCOMPLETE && (
              <Link href={`/vote-events/${voteEvent.id}`} passHref>
                <Tooltip title="Edit vote event" placement="top">
                  <Button id="edit-vote-event-button">Vote</Button>
                </Tooltip>
              </Link>
            )}
            <Link href={`/vote-events/${voteEvent.id}/edit`} passHref>
              <Tooltip title="Edit vote event" placement="top">
                <Button id="edit-vote-event-button">Edit</Button>
              </Tooltip>
            </Link>
            <Button
              id="delete-vote-event-button"
              onClick={handleOpenDeleteModal}
              sx={{
                transition: BASE_TRANSITION,
                "&:hover": { backgroundColor: "error.main", color: "white" },
              }}
            >
              Delete
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};
export default VoteEventRow;

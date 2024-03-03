import { Mutate } from "@/hooks/useFetch";
import DeleteVoteEventModal from "@/components/modals/DeleteVoteEventModal";
import { BASE_TRANSITION } from "@/styles/constants";
import { GetVoteEventsResponse } from "@/types/api";
import { VoteEvent } from "@/types/voteEvents";
import { Button, Stack, TableCell, TableRow, Tooltip } from "@mui/material";
import Link from "next/link";
import { FC, useState } from "react";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";

type Props = {
  voteEvent: VoteEvent;
  mutate: Mutate<GetVoteEventsResponse>;
};

const VoteEventRow: FC<Props> = ({ voteEvent, mutate }) => {
  const [isDeleteVoteEventOpen, setIsDeleteVoteEventOpen] = useState(false);

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
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            <Link href={`/vote-events/${voteEvent.id}/edit`} passHref>
              <Tooltip
                title="View and edit deadline questions"
                placement="left"
              >
                <Button id="edit-user-button">Edit</Button>
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

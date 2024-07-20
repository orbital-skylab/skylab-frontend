import DeleteVoteModal from "@/components/modals/DeleteVoteModal";
import { Mutate } from "@/hooks/useFetch";
import { BASE_TRANSITION } from "@/styles/constants";
import { GetVoteEventVotesResponse } from "@/types/api";
import { Vote } from "@/types/voteEvents";
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  vote: Vote;
  mutate: Mutate<GetVoteEventVotesResponse>;
};

const VoteRow: FC<Props> = ({ voteEventId, vote, mutate }) => {
  const [isDeleteVoteOpen, setIsDeleteVoteOpen] = useState(false);
  const { userId, externalVoterId, internalVoter, project } = vote;
  const isUserVote = vote.userId !== null;
  const voterName = internalVoter ? internalVoter.name : "-";

  const handleOpenDeleteModal = () => {
    setIsDeleteVoteOpen(true);
  };

  return (
    <>
      <DeleteVoteModal
        voteEventId={voteEventId}
        vote={vote}
        open={isDeleteVoteOpen}
        setOpen={setIsDeleteVoteOpen}
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{isUserVote ? userId : externalVoterId}</TableCell>
        <TableCell>{voterName}</TableCell>
        <TableCell>{project.id}</TableCell>
        <TableCell>{project.name}</TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            <Button
              id={`delete-vote-${vote.id}-button`}
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
export default VoteRow;

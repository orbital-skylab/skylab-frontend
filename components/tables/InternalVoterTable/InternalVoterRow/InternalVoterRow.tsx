import DeleteInternalVoterModal from "@/components/modals/DeleteInternalVoterModal";
import { Mutate } from "@/hooks/useFetch";
import { BASE_TRANSITION } from "@/styles/constants";
import { GetInternalVotersResponse } from "@/types/api";
import { User } from "@/types/users";
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  internalVoter: User;
  mutate: Mutate<GetInternalVotersResponse>;
};

const InternalVoterRow: FC<Props> = ({
  voteEventId,
  internalVoter,
  mutate,
}) => {
  const [isDeleteInternalVoterOpen, setIsDeleteInternalVoterOpen] =
    useState(false);

  const handleOpenDeleteModal = () => {
    setIsDeleteInternalVoterOpen(true);
  };

  return (
    <>
      <DeleteInternalVoterModal
        voteEventId={voteEventId}
        internalVoter={internalVoter}
        open={isDeleteInternalVoterOpen}
        setOpen={setIsDeleteInternalVoterOpen}
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{internalVoter.email}</TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            <Button
              id="delete-internal-voter-button"
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
export default InternalVoterRow;

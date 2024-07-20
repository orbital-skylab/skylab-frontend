import DeleteExternalVoterModal from "@/components/modals/DeleteExternalVoterModal";
import { Mutate } from "@/hooks/useFetch";
import { BASE_TRANSITION } from "@/styles/constants";
import { GetExternalVotersResponse } from "@/types/api";
import { ExternalVoter } from "@/types/voteEvents";
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  externalVoter: ExternalVoter;
  mutate: Mutate<GetExternalVotersResponse>;
};

const ExternalVoterRow: FC<Props> = ({ externalVoter, mutate }) => {
  const [isDeleteExternalVoterOpen, setIsDeleteExternalVoterOpen] =
    useState(false);

  const handleOpenDeleteModal = () => {
    setIsDeleteExternalVoterOpen(true);
  };

  return (
    <>
      <DeleteExternalVoterModal
        externalVoter={externalVoter}
        open={isDeleteExternalVoterOpen}
        setOpen={setIsDeleteExternalVoterOpen}
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{externalVoter.id}</TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            <Button
              id={`delete-external-voter-${externalVoter.id}-button`}
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
export default ExternalVoterRow;

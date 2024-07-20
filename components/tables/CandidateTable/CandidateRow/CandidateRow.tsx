import DeleteCandidateModal from "@/components/modals/DeleteCandidateModal";
import { Mutate } from "@/hooks/useFetch";
import { BASE_TRANSITION } from "@/styles/constants";
import { GetCandidatesResponse } from "@/types/api";
import { Project } from "@/types/projects";
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import { FC, useState } from "react";

type Props = {
  voteEventId: number;
  candidate: Project;
  mutate: Mutate<GetCandidatesResponse>;
};

const CandidateRow: FC<Props> = ({ voteEventId, candidate, mutate }) => {
  const [isDeleteCandidateOpen, setIsDeleteCandidateOpen] = useState(false);

  const handleOpenDeleteModal = () => {
    setIsDeleteCandidateOpen(true);
  };

  return (
    <>
      <DeleteCandidateModal
        voteEventId={voteEventId}
        candidate={candidate}
        open={isDeleteCandidateOpen}
        setOpen={setIsDeleteCandidateOpen}
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{candidate.id}</TableCell>
        <TableCell>{candidate.name}</TableCell>
        <TableCell>{candidate.cohortYear}</TableCell>
        <TableCell>{candidate.achievement}</TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            <Button
              id={`delete-candidate-${candidate.id}-button`}
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
export default CandidateRow;

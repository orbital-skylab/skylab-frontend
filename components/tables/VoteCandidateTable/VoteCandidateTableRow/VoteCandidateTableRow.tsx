import { Project } from "@/types/projects";
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import { Dispatch, FC, SetStateAction } from "react";

type Props = {
  candidate: Project;
  isSelected: boolean;
  setSelectedCandidates: Dispatch<SetStateAction<{ [key: number]: boolean }>>;
};

const VoteCandidateRow: FC<Props> = ({
  candidate,
  isSelected,
  setSelectedCandidates,
}) => {
  const handleToggleSelected = () => {
    setSelectedCandidates((prevSelectedCandidates) => ({
      ...prevSelectedCandidates,
      [candidate.id]: !isSelected,
    }));
  };

  return (
    <>
      <TableRow>
        <TableCell>{candidate.id}</TableCell>
        <TableCell>{candidate.name}</TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            <Button
              id={`candidate-${candidate.id}-vote-button`}
              variant="contained"
              onClick={handleToggleSelected}
              sx={{
                backgroundColor: isSelected ? "success" : "primary",
              }}
            >
              {isSelected ? "Voted" : "Vote"}
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};
export default VoteCandidateRow;

import { FC, useState } from "react";
// Components
import { Button, Stack, TableCell, TableRow } from "@mui/material";
// Helpers
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
// Types
import { Mutate } from "@/hooks/useFetch";
import { Cohort, GetCohortsResponse } from "@/types/cohorts";
import EditCohortModal from "@/components/modals/EditCohortModal";
import DeleteCohortModal from "@/components/modals/DeleteCohortModal";

type Props = { cohort: Cohort; mutate: Mutate<GetCohortsResponse> };

const CohortRow: FC<Props> = ({ cohort, mutate }) => {
  const [isEditCohortOpen, setIsEditCohortOpen] = useState(false);
  const [isDeleteCohortOpen, setIsDeleteCohortOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditCohortOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteCohortOpen(true);
  };

  return (
    <>
      <DeleteCohortModal
        cohort={cohort}
        open={isDeleteCohortOpen}
        setOpen={setIsDeleteCohortOpen}
        mutate={mutate}
      />
      <EditCohortModal
        cohort={cohort}
        open={isEditCohortOpen}
        setOpen={setIsEditCohortOpen}
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{cohort.academicYear}</TableCell>
        <TableCell>{isoDateToLocaleDateWithTime(cohort.startDate)}</TableCell>
        <TableCell>{isoDateToLocaleDateWithTime(cohort.endDate)}</TableCell>
        <TableCell>
          <Stack direction="row" spacing="0.5rem">
            <Button size="small" onClick={handleOpenEditModal}>
              Edit
            </Button>
            <Button
              size="small"
              onClick={handleOpenDeleteModal}
              sx={{
                "&:hover": {
                  color: "white",
                  backgroundColor: "error.main",
                },
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
export default CohortRow;

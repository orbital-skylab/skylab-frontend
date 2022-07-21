import { FC, useState } from "react";
import Link from "next/link";
// Components
import { Button, Stack, TableCell, TableRow, Tooltip } from "@mui/material";
import EditDeadlineModal from "@/components/modals/EditDeadlineModal";
import SnackbarAlert from "@/components/layout/SnackbarAlert";
import DeleteDeadlineModal from "@/components/modals/DeleteDeadlineModal";
// Helpers
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { PAGES } from "@/helpers/navigation";
// Hooks
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import { Deadline } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";
import { GetDeadlinesResponse } from "@/types/api";
// Constants
import { BASE_TRANSITION } from "@/styles/constants";

type Props = { deadline: Deadline; mutate: Mutate<GetDeadlinesResponse> };

const DeadlineRow: FC<Props> = ({ deadline, mutate }) => {
  const { snackbar, setSuccess, setError, handleClose } = useSnackbarAlert();
  const [isEditDeadlineOpen, setIsEditDeadlineOpen] = useState(false);
  const [isDeleteDeadlineOpen, setIsDeleteDeadlineOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditDeadlineOpen(true);
  };

  const handleOpenDeleteModal = () => {
    setIsDeleteDeadlineOpen(true);
  };

  return (
    <>
      <DeleteDeadlineModal
        deadline={deadline}
        open={isDeleteDeadlineOpen}
        setOpen={setIsDeleteDeadlineOpen}
        mutate={mutate}
        setSuccess={setSuccess}
        setError={setError}
      />
      <EditDeadlineModal
        deadline={deadline}
        open={isEditDeadlineOpen}
        setOpen={setIsEditDeadlineOpen}
        mutate={mutate}
        setSuccess={setSuccess}
        setError={setError}
      />
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <TableRow>
        <TableCell>{deadline.name}</TableCell>
        <TableCell>{deadline.type}</TableCell>
        <TableCell>{isoDateToLocaleDateWithTime(deadline.dueBy)}</TableCell>
        <TableCell>
          <Stack direction="row" spacing="0.5rem">
            <Link href={`${PAGES.MANAGE_DEADLINES}/${deadline.id}`} passHref>
              <Tooltip
                title="View and edit deadline questions"
                placement="left"
              >
                <Button>Questions</Button>
              </Tooltip>
            </Link>
            <Button onClick={handleOpenEditModal}>Edit</Button>
            <Button
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
export default DeadlineRow;

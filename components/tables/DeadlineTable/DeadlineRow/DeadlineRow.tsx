import { FC, useState } from "react";
import Link from "next/link";
// Components
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import EditDeadlineModal from "@/components/modals/EditDeadlineModal";
import SnackbarAlert from "@/components/SnackbarAlert";
import DeleteDeadlineModal from "@/components/modals/DeleteDeadlineModal";
// Helpers
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { PAGES } from "@/helpers/navigation";
// Hooks
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import { Deadline } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";
import { GetDeadlinesResponse } from "@/pages/manage/deadlines";

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
              <Button
                size="small"
                sx={{
                  "&:hover": {
                    color: "white",
                    backgroundColor: "info.main",
                  },
                }}
              >
                Questions
              </Button>
            </Link>
            <Button
              size="small"
              onClick={handleOpenEditModal}
              sx={{
                "&:hover": {
                  color: "white",
                  backgroundColor: "warning.main",
                },
              }}
            >
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
export default DeadlineRow;

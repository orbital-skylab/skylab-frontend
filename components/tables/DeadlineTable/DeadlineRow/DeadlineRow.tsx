import { FC, useState } from "react";
import Link from "next/link";
// Components
import { Button, Stack, TableCell, TableRow, Tooltip } from "@mui/material";
import EditDeadlineModal from "@/components/modals/EditDeadlineModal";
import DeleteDeadlineModal from "@/components/modals/DeleteDeadlineModal";
// Helpers
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { PAGES } from "@/helpers/navigation";
// Types
import { Deadline } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";
import { GetDeadlinesResponse } from "@/types/api";
// Constants
import { BASE_TRANSITION } from "@/styles/constants";
import DuplicateDeadlineModal from "@/components/modals/DuplicateDeadlineModal";

type Props = {
  deadline: Deadline;
  deadlines: Deadline[];
  mutate: Mutate<GetDeadlinesResponse>;
};

const DeadlineRow: FC<Props> = ({ deadline, deadlines, mutate }) => {
  const [isEditDeadlineOpen, setIsEditDeadlineOpen] = useState(false);
  const [isDuplicateModalOpen, setIsDuplicateModalOpen] = useState(false);
  const [isDeleteDeadlineOpen, setIsDeleteDeadlineOpen] = useState(false);

  const handleOpenEditModal = () => {
    setIsEditDeadlineOpen(true);
  };

  const handleOpenDuplicateModal = () => {
    setIsDuplicateModalOpen(true);
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
      />
      <EditDeadlineModal
        deadline={deadline}
        deadlines={deadlines}
        open={isEditDeadlineOpen}
        setOpen={setIsEditDeadlineOpen}
        mutate={mutate}
      />
      <DuplicateDeadlineModal
        deadline={deadline}
        open={isDuplicateModalOpen}
        setOpen={setIsDuplicateModalOpen}
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{deadline.id}</TableCell>
        <TableCell className="deadline-name-td">{deadline.name}</TableCell>
        <TableCell>{deadline.type}</TableCell>
        <TableCell>
          {deadline.evaluating ? deadline.evaluating.name : "-"}
        </TableCell>
        <TableCell>{isoDateToLocaleDateWithTime(deadline.dueBy)}</TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing="0.5rem" justifyContent="end">
            <Link href={`${PAGES.MANAGE_DEADLINES}/${deadline.id}`} passHref>
              <Tooltip
                title="View and edit deadline questions"
                placement="left"
              >
                <Button id="view-questions-button">Questions</Button>
              </Tooltip>
            </Link>
            <Button id="edit-deadline-button" onClick={handleOpenEditModal}>
              Edit
            </Button>
            <Button
              id="duplicate-deadline-button"
              onClick={handleOpenDuplicateModal}
            >
              Duplicate
            </Button>
            <Button
              id="delete-deadline-button"
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

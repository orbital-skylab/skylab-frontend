import { FC, useState, MouseEvent } from "react";
import Link from "next/link";
// Components
import {
  Button,
  Menu,
  MenuItem,
  Stack,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import EditDeadlineModal from "@/components/modals/EditDeadlineModal";
import SnackbarAlert from "@/components/SnackbarAlert";
import DeleteDeadlineModal from "@/components/modals/DeleteDeadlineModal";
import { KeyboardArrowDown } from "@mui/icons-material";
// Helpers
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { PAGES } from "@/helpers/navigation";
// Hooks
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
// Types
import { Deadline } from "@/types/deadlines";
import { Mutate } from "@/hooks/useFetch";
import { GetDeadlinesResponse } from "@/types/api";

type Props = { deadline: Deadline; mutate: Mutate<GetDeadlinesResponse> };

const DeadlineRow: FC<Props> = ({ deadline, mutate }) => {
  const { snackbar, setSuccess, setError, handleClose } = useSnackbarAlert();
  const [dropdownAnchorElement, setDropdownAnchorElement] =
    useState<HTMLElement | null>(null);
  const [isEditDeadlineOpen, setIsEditDeadlineOpen] = useState(false);
  const [isDeleteDeadlineOpen, setIsDeleteDeadlineOpen] = useState(false);

  const handleOpenDropdown = (e: MouseEvent<HTMLButtonElement>) => {
    setDropdownAnchorElement(e.currentTarget);
  };

  const handleCloseDropdown = () => {
    setDropdownAnchorElement(null);
  };

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
          <Stack direction="row" spacing="0.5rem"></Stack>
          <Button
            variant="outlined"
            size="small"
            onClick={handleOpenDropdown}
            endIcon={<KeyboardArrowDown />}
          >
            Options
          </Button>
          <Menu
            anchorEl={dropdownAnchorElement}
            open={Boolean(dropdownAnchorElement)}
            onClose={handleCloseDropdown}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Link href={`${PAGES.MANAGE_DEADLINES}/${deadline.id}`} passHref>
              <Tooltip title="View and edit deadline questions">
                <MenuItem>View Questions</MenuItem>
              </Tooltip>
            </Link>
            <MenuItem onClick={handleOpenEditModal}>Edit</MenuItem>
            <MenuItem onClick={handleOpenDeleteModal}>Delete</MenuItem>
          </Menu>
        </TableCell>
      </TableRow>
    </>
  );
};
export default DeadlineRow;

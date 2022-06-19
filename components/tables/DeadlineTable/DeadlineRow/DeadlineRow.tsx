import { FC, useState } from "react";
// Components
import { Button, Stack, TableCell, TableRow } from "@mui/material";
// Helpers
import { formatFullDateWithTime } from "@/helpers/dates";
// Types
import { Deadline } from "@/types/deadlines";
import Link from "next/link";
import { PAGES } from "@/helpers/navigation";
import EditDeadlineModal from "@/components/modals/EditDeadlineModal";

type Props = { deadline: Deadline };

const DeadlineRow: FC<Props> = ({ deadline }) => {
  const [isEditDeadlineOpen, setIsEditDeadlineOpen] = useState(false);

  const handleOpenModal = () => {
    setIsEditDeadlineOpen(true);
  };

  return (
    <>
      <EditDeadlineModal
        deadline={deadline}
        open={isEditDeadlineOpen}
        setOpen={setIsEditDeadlineOpen}
      />
      <TableRow>
        <TableCell>{deadline.name}</TableCell>
        <TableCell>{formatFullDateWithTime(deadline.dueBy)}</TableCell>
        <TableCell>
          <Stack direction="row" spacing="0.5rem">
            <Link href={`${PAGES.DEADLINES}/${deadline.id}`} passHref>
              <Button size="small" variant="contained" color="info">
                View Questions
              </Button>
            </Link>
            <Button
              size="small"
              variant="contained"
              color="warning"
              onClick={handleOpenModal}
            >
              Edit
            </Button>
            <Button size="small" variant="contained" color="error">
              Delete
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};
export default DeadlineRow;

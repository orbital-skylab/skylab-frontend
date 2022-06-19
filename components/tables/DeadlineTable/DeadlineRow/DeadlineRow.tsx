import { FC, useState } from "react";
// Components
import { Button, Stack, TableCell, TableRow } from "@mui/material";
// Helpers
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
// Types
import { Deadline } from "@/types/deadlines";
import Link from "next/link";
import { PAGES } from "@/helpers/navigation";
import EditDeadlineModal from "@/components/modals/EditDeadlineModal";
import { Mutate } from "@/hooks/useFetch";
import { GetDeadlinesResponse } from "@/pages/deadlines";

type Props = { deadline: Deadline; mutate: Mutate<GetDeadlinesResponse> };

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
        mutate={mutate}
      />
      <TableRow>
        <TableCell>{deadline.name}</TableCell>
        <TableCell>{isoDateToLocaleDateWithTime(deadline.dueBy)}</TableCell>
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

import { FC, useState } from "react";
import Link from "next/link";
// Components
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import WithdrawApplicationModal from "@/components/modals/WithdrawApplicationModal";
// Helpers
import { PAGES } from "@/helpers/navigation";
// Types
import { Mutate } from "@/hooks/useFetch";
import { BASE_TRANSITION } from "@/styles/constants";
import { Application } from "@/types/applications";
import RejectApplicationModal from "@/components/modals/RejectApplicationModal";
import ApproveApplicationModal from "@/components/modals/ApproveApplicationModal";

type Props = {
  id: number;
  application: Application;
  mutate: Mutate<Application[]>;
};

const ApplicationRow: FC<Props> = ({ id, application, mutate }) => {
  const [isApproveApplicationOpen, setIsApproveApplicationOpen] =
    useState(false);
  const [isRejectApplicationOpen, setIsRejectApplicationOpen] = useState(false);
  const [isWithdrawApplicationOpen, setIsWithdrawApplicationOpen] =
    useState(false);

  const handleOpenApproveModal = () => setIsApproveApplicationOpen(true);
  const handleOpenRejectModal = () => setIsRejectApplicationOpen(true);
  const handleOpenWithdrawModal = () => setIsWithdrawApplicationOpen(true);

  return (
    <>
      <WithdrawApplicationModal
        open={isWithdrawApplicationOpen}
        setOpen={setIsWithdrawApplicationOpen}
        application={application}
        mutate={mutate}
      />
      <RejectApplicationModal
        open={isRejectApplicationOpen}
        setOpen={setIsRejectApplicationOpen}
        application={application}
        mutate={mutate}
      />
      <ApproveApplicationModal
        open={isApproveApplicationOpen}
        setOpen={setIsApproveApplicationOpen}
        application={application}
        mutate={mutate}
      />
      <TableRow id="application-row">
        <TableCell>{id}</TableCell>
        <TableCell>{application.teamName}</TableCell>
        <TableCell>{application.achievement}</TableCell>
        <TableCell>{application.status}</TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing="0.5rem">
            <Link
              href={`${PAGES.SUBMISSIONS}/${application.submissionId}`}
              passHref
            >
              <Button>View</Button>
            </Link>
            <Button
              id="approve-application-button"
              onClick={handleOpenApproveModal}
              sx={{
                transition: BASE_TRANSITION,
                "&:hover": {
                  backgroundColor: "success.main",
                  color: "white",
                },
              }}
            >
              Approve
            </Button>
            <Button
              id="reject-application-button"
              onClick={handleOpenRejectModal}
              sx={{
                transition: BASE_TRANSITION,
                "&:hover": {
                  backgroundColor: "error.main",
                  color: "white",
                },
              }}
            >
              Reject
            </Button>
            <Button
              id="withdraw-application-button"
              onClick={handleOpenWithdrawModal}
              sx={{
                transition: BASE_TRANSITION,
                "&:hover": {
                  backgroundColor: "error.main",
                  color: "white",
                },
              }}
            >
              Withdraw
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};
export default ApplicationRow;

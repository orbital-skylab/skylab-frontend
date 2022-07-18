import { FC } from "react";
import Link from "next/link";
// Components
import { Box, Button, TableCell, TableRow } from "@mui/material";
import { LoadingButton } from "@mui/lab";
// Helpers
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import {
  generateSubmissionStatus,
  getToProjectOrUserId,
} from "@/helpers/submissions";
import { PAGES } from "@/helpers/navigation";
// Hooks
import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/router";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
// Types
import { DeadlineDeliverable } from "@/types/deadlines";
import { STATUS } from "@/types/submissions";
import { CreateSubmissionResponse, HTTP_METHOD } from "@/types/api";

type Props = { deadlineDeliverable: DeadlineDeliverable };

const DeadlineDeliverableRow: FC<Props> = ({ deadlineDeliverable }) => {
  const { user } = useAuth();
  const router = useRouter();

  const createSubmission = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: "/submissions",
    body: {
      deadlineId: deadlineDeliverable.deadline.id,
      answers: [],
      fromProjectId: user?.student?.projectId,
      ...getToProjectOrUserId(deadlineDeliverable),
    },
    onSuccess: (newSubmission: CreateSubmissionResponse) => {
      router.push(`${PAGES.SUBMISSIONS}/${newSubmission.id}`);
    },
  });

  const generateToCell = (deadlineDeliverable: DeadlineDeliverable) => {
    if (deadlineDeliverable.toProject && deadlineDeliverable.toUser) {
      alert(
        "There should not be a deadline deliverable addressed to a project and a user"
      );
      return "Error";
    } else if (deadlineDeliverable.toProject) {
      return (
        <Link href={`${PAGES.PROJECTS}/${deadlineDeliverable.toProject.id}`}>
          {deadlineDeliverable.toProject.name}
        </Link>
      );
    } else if (deadlineDeliverable.toUser) {
      return (
        <Link href={`${PAGES.USERS}/${deadlineDeliverable.toUser.id}`}>
          {deadlineDeliverable.toUser.name}
        </Link>
      );
    } else {
      return "-";
    }
  };

  const status = generateSubmissionStatus({
    submissionId: deadlineDeliverable.submission?.id,
    isDraft: deadlineDeliverable.submission?.isDraft,
    updatedAt: deadlineDeliverable.submission?.updatedAt,
    dueBy: deadlineDeliverable.deadline.dueBy,
  });

  const generateStatusCell = (status: STATUS) => {
    switch (status) {
      case STATUS.NOT_YET_STARTED: {
        return (
          <Box component="span" sx={{ color: "gray" }}>
            Not Yet Started
          </Box>
        );
      }
      case STATUS.SAVED_DRAFT: {
        return "Saved Draft";
      }
      case STATUS.SUBMITTED: {
        return (
          <Box component="span" sx={{ color: "success.main" }}>
            Submitted
          </Box>
        );
      }
      case STATUS.SUBMITTED_LATE: {
        return (
          <Box component="span" sx={{ color: "error.main" }}>
            Submitted Late
          </Box>
        );
      }
      default:
        alert("An error has occurred while rendering statuses");
        return "Error";
    }
  };

  const generateActionCell = (
    deadlineDeliverable: DeadlineDeliverable,
    status: STATUS
  ) => {
    switch (status) {
      case STATUS.NOT_YET_STARTED: {
        return (
          <LoadingButton
            loading={isCalling(createSubmission.status)}
            onClick={createSubmission.call}
          >
            Start
          </LoadingButton>
        );
      }
      case STATUS.SAVED_DRAFT: {
        return (
          <Link
            href={`${PAGES.SUBMISSIONS}/${deadlineDeliverable.submission?.id}`}
            passHref
          >
            <Button>Continue</Button>
          </Link>
        );
      }
      case (STATUS.SUBMITTED, STATUS.SUBMITTED_LATE): {
        return (
          <Link
            href={`${PAGES.SUBMISSIONS}/${deadlineDeliverable.submission?.id}`}
            passHref
          >
            <Button>Edit</Button>
          </Link>
        );
      }
      default:
        alert("An error has occurred while rendering buttons");
        return <Button>Error</Button>;
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{deadlineDeliverable.deadline.name}</TableCell>
        <TableCell>{generateToCell(deadlineDeliverable)}</TableCell>
        <TableCell>
          {isoDateToLocaleDateWithTime(deadlineDeliverable.deadline.dueBy)}
        </TableCell>
        <TableCell>{generateStatusCell(status)}</TableCell>
        <TableCell>{generateActionCell(deadlineDeliverable, status)}</TableCell>
      </TableRow>
    </>
  );
};
export default DeadlineDeliverableRow;

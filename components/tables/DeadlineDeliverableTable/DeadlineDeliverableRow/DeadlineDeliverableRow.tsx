import { FC } from "react";
import Link from "next/link";
// Components
import {
  Box,
  Button,
  TableCell,
  TableRow,
  Typography,
  Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// Helpers
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import {
  generateSubmissionStatus,
  getFromProjectOrUserId,
  getToProjectOrUserId,
} from "@/helpers/submissions";
import { PAGES } from "@/helpers/navigation";
// Hooks
import useAuth from "@/contexts/useAuth";
import { useRouter } from "next/router";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
// Types
import {
  DeadlineDeliverable,
  DEADLINE_TYPE,
  VIEWER_ROLE,
} from "@/types/deadlines";
import { STATUS } from "@/types/submissions";
import { CreateSubmissionResponse, HTTP_METHOD } from "@/types/api";

type Props = {
  deadlineDeliverable: DeadlineDeliverable;
  viewerRole: VIEWER_ROLE;
};

const DeadlineDeliverableRow: FC<Props> = ({
  deadlineDeliverable,
  viewerRole,
}) => {
  const { user } = useAuth();
  const router = useRouter();

  const createSubmission = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: "/submissions",
    body: {
      deadlineId: deadlineDeliverable.deadline.id,
      ...getFromProjectOrUserId(user, viewerRole),
      ...getToProjectOrUserId(deadlineDeliverable),
    },
    onSuccess: (newSubmission: CreateSubmissionResponse) => {
      router.push(`${PAGES.SUBMISSIONS}/${newSubmission.id}`);
    },
  });

  const handleClickStart = () => {
    createSubmission.call();
  };

  const generateDeadlineCell = (deadlineDeliverable: DeadlineDeliverable) => {
    switch (deadlineDeliverable.deadline.type) {
      case DEADLINE_TYPE.MILESTONE:
        return `${deadlineDeliverable.deadline.name} Submission`;

      case DEADLINE_TYPE.EVALUATION:
      case DEADLINE_TYPE.FEEDBACK: {
        if (
          (deadlineDeliverable.toProject && deadlineDeliverable.toUser) ||
          (!deadlineDeliverable.toProject && !deadlineDeliverable.toUser)
        ) {
          alert(
            "An evaluation and feedback must be addressed to either a project or a user"
          );
          return "Error";
        }

        if (deadlineDeliverable.toProject) {
          return (
            <Stack
              className="deadline-deliverable-row"
              direction="row"
              spacing="0.5rem"
            >
              <Typography>{`${deadlineDeliverable.deadline.name} for`}</Typography>
              <Button
                variant="outlined"
                size="small"
                disabled={
                  !deadlineDeliverable.toProjectSubmission ||
                  !deadlineDeliverable.toProjectSubmission.id
                }
                href={`${PAGES.SUBMISSIONS}/${deadlineDeliverable.toProjectSubmission?.id}`}
              >
                {deadlineDeliverable.toProject.name}
              </Button>
            </Stack>
          );
        } else if (deadlineDeliverable.toUser) {
          return (
            <Stack direction="row" spacing="0.5rem">
              <Typography>{`${deadlineDeliverable.deadline.name} for`}</Typography>
              <Button
                variant="outlined"
                size="small"
                href={`${PAGES.USERS}/${deadlineDeliverable.toUser.id}`}
              >
                {deadlineDeliverable.toUser.name}
              </Button>
            </Stack>
          );
        }
      }
    }
  };

  const status = generateSubmissionStatus({
    submissionId: deadlineDeliverable.submission?.id,
    isDraft: deadlineDeliverable.submission?.isDraft,
    updatedAt: deadlineDeliverable.submission?.updatedAt,
    dueBy: deadlineDeliverable.deadline.dueBy,
  });

  const generateStatusCell = (
    status: STATUS,
    updatedAt: string | undefined
  ) => {
    const dateOn = updatedAt
      ? `on ${isoDateToLocaleDateWithTime(updatedAt)}`
      : "";

    switch (status) {
      case STATUS.NOT_YET_STARTED: {
        return (
          <Box component="span" sx={{ color: "gray" }}>
            Not yet started
          </Box>
        );
      }
      case STATUS.SAVED_DRAFT: {
        return "Saved Draft";
      }
      case STATUS.SUBMITTED: {
        return (
          <Box component="span" sx={{ color: "success.main" }}>
            Submitted {dateOn}
          </Box>
        );
      }
      case STATUS.SUBMITTED_LATE: {
        return (
          <Box component="span" sx={{ color: "error.main" }}>
            Submitted late {dateOn}
          </Box>
        );
      }
      default:
        alert("An error has occurred while rendering statuses");
        return "Error";
    }
  };

  const generateActionCell = (
    status: STATUS,
    deadlineDeliverable: DeadlineDeliverable
  ) => {
    switch (status) {
      case STATUS.NOT_YET_STARTED: {
        return (
          <LoadingButton
            loading={isCalling(createSubmission.status)}
            onClick={handleClickStart}
            disabled={
              deadlineDeliverable.toProject &&
              (!deadlineDeliverable.toProjectSubmission ||
                !deadlineDeliverable.toProjectSubmission.id)
            }
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
        <TableCell>{generateDeadlineCell(deadlineDeliverable)}</TableCell>
        <TableCell>
          {isoDateToLocaleDateWithTime(deadlineDeliverable.deadline.dueBy)}
        </TableCell>
        <TableCell>
          {generateStatusCell(
            status,
            deadlineDeliverable.submission?.updatedAt
          )}
        </TableCell>
        <TableCell>{generateActionCell(status, deadlineDeliverable)}</TableCell>
      </TableRow>
    </>
  );
};
export default DeadlineDeliverableRow;

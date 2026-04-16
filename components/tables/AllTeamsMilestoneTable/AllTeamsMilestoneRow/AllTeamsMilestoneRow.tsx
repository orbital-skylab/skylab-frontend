import { FC } from "react";
// Components
import { Box, Chip, Stack, TableCell, TableRow } from "@mui/material";
import HoverLink from "@/components/typography/HoverLink";
import UsersName from "@/components/typography/UsersName";
// Helpers
import { generateSubmissionStatus } from "@/helpers/submissions";
import { PAGES } from "@/helpers/navigation";
// Types
import { PossibleSubmission, STATUS } from "@/types/submissions";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { Deadline } from "@/types/deadlines";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";

type Props = {
  deadline: Deadline | null;
  submission: PossibleSubmission;
  milestoneDeadlines: Deadline[];
};

const AllTeamsMilestoneRow: FC<Props> = ({
  deadline,
  submission,
  milestoneDeadlines,
}) => {
  const status = generateSubmissionStatus({
    submissionId: submission.id,
    isDraft: false, // You cannot view other's drafts
    updatedAt: submission.updatedAt,
    dueBy: deadline?.dueBy || "",
  });

  const generateSubmissionStatusForSub = (sub: PossibleSubmission) => {
    const deadline = milestoneDeadlines.find((d) => d.id === sub.deadlineId);
    return generateSubmissionStatus({
      submissionId: sub.id,
      isDraft: false,
      updatedAt: sub.updatedAt,
      dueBy: deadline ? deadline.dueBy : "",
    });
  };

  const generateFromCell = (submission: PossibleSubmission) => {
    if (submission.fromProject) {
      return (
        <HoverLink
          href={`${PAGES.PROJECTS}/${submission.fromProject.id}`}
          variant="body2"
        >
          {submission.fromProject.name}
        </HoverLink>
      );
    } else {
      alert("The milestone submission MUST be submitted from a project");
      return "Error";
    }
  };

  const generateStatusCell = (
    status: STATUS,
    updatedAt: string | undefined,
    submissionId: number | undefined
  ) => {
    const dateOn = updatedAt
      ? `on ${isoDateToLocaleDateWithTime(updatedAt)}`
      : "";

    switch (status) {
      case STATUS.NOT_YET_STARTED: {
        return (
          <Box component="span" sx={{ color: "gray" }}>
            Not yet submitted
          </Box>
        );
      }
      case STATUS.SAVED_DRAFT: {
        return "In Progress";
      }
      case STATUS.SUBMITTED: {
        return (
          <HoverLink
            href={`${PAGES.SUBMISSIONS}/${submissionId}`}
            wrap={true}
            variant="body2"
          >
            <Box component="span" sx={{ color: "success.main" }}>
              Submitted {dateOn}
            </Box>
          </HoverLink>
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

  const renderTag = () => {
    if (!submission.fromProject?.achievement) return;

    switch (submission.fromProject?.achievement) {
      case LEVELS_OF_ACHIEVEMENT.VOSTOK:
        return (
          <Chip
            key={`project ${submission.fromProject?.id}`}
            label={LEVELS_OF_ACHIEVEMENT.VOSTOK}
            color="primary"
            size="small"
          />
        );
      case LEVELS_OF_ACHIEVEMENT.GEMINI:
        return (
          <Chip
            key={`project ${submission.fromProject?.id}`}
            label={LEVELS_OF_ACHIEVEMENT.GEMINI}
            color="secondary"
            size="small"
          />
        );
      case LEVELS_OF_ACHIEVEMENT.APOLLO:
        return (
          <Chip
            key={`project ${submission.fromProject?.id}`}
            label={LEVELS_OF_ACHIEVEMENT.APOLLO}
            color="info"
            size="small"
          />
        );

      case LEVELS_OF_ACHIEVEMENT.ARTEMIS:
        return (
          <Chip
            key={`project ${submission.fromProject?.id}`}
            label={LEVELS_OF_ACHIEVEMENT.ARTEMIS}
            color="success"
            size="small"
          />
        );
    }
  };

  const submissionArray = Array.isArray(submission.submission)
    ? submission.submission
    : submission.submission
    ? [submission.submission]
    : [];

  return (
    <>
      <TableRow>
        <TableCell>{submission.fromProject?.id}</TableCell>
        <TableCell>{submission.fromProject?.teamName}</TableCell>
        <TableCell>{generateFromCell(submission)}</TableCell>
        <TableCell className="project-achievement-level-td">
          <Stack direction="row" spacing="0.25rem">
            {renderTag()}
          </Stack>
        </TableCell>
        <TableCell>
          {submission.fromProject?.students
            ? submission.fromProject?.students.map((student) => (
                <UsersName key={student.id} user={student} />
              ))
            : "-"}
        </TableCell>
        <TableCell>
          {submission.fromProject?.adviser &&
          submission.fromProject?.adviser.id ? (
            <UsersName user={submission.fromProject?.adviser} />
          ) : (
            "-"
          )}
        </TableCell>
        <TableCell>
          {submission.fromProject?.mentor &&
          submission.fromProject?.mentor.id ? (
            <UsersName user={submission.fromProject?.mentor} />
          ) : (
            "-"
          )}
        </TableCell>

        {deadline ? (
          <>
            <TableCell>
              {generateStatusCell(status, submission.updatedAt, submission.id)}
            </TableCell>
          </>
        ) : (
          milestoneDeadlines.map((milestone) => {
            const sub = submissionArray.find(
              (sub) => sub.deadlineId === milestone.id
            );
            const status = sub
              ? generateSubmissionStatusForSub(sub)
              : STATUS.NOT_YET_STARTED;
            const updatedAt = sub ? sub.updatedAt : undefined;

            return (
              <TableCell key={milestone.id}>
                {generateStatusCell(status, updatedAt, sub?.id)}
              </TableCell>
            );
          })
        )}
      </TableRow>
    </>
  );
};
export default AllTeamsMilestoneRow;

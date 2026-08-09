import { FC } from "react";
// Components
import HoverLink from "@/components/typography/HoverLink";
import { Box, TableCell, TableRow } from "@mui/material";
// Helpers
import { PAGES } from "@/helpers/navigation";
import { generateSubmissionStatus } from "@/helpers/submissions";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
// Types
import { PossibleSubmission, STATUS, Submission } from "@/types/submissions";
import { Deadline } from "@/types/deadlines";

type Props = {
  data: PossibleSubmission;
  evaluationDeadlines: Deadline[];
  deadline: Deadline | null;
};

const EvaluationsRow: FC<Props> = ({ data, evaluationDeadlines, deadline }) => {
  const getSubForDeadline = (deadlineId: number): Submission | null => {
    const sub = data.submission;

    if (!sub) return null;

    if (Array.isArray(sub)) {
      return sub.find((s) => s.deadlineId === deadlineId) || null;
    }

    return sub.deadlineId === deadlineId ? sub : null;
  };

  const singleSub = deadline ? getSubForDeadline(deadline.id) : null;

  const status = generateSubmissionStatus({
    submissionId: singleSub?.id,
    isDraft: false,
    updatedAt: singleSub?.updatedAt,
    dueBy: deadline?.dueBy || "",
  });

  const generateStatusCell = (
    status: STATUS,
    updatedAt: string | undefined,
    submissionId: number | undefined
  ) => {
    const dateOn = updatedAt
      ? `on ${isoDateToLocaleDateWithTime(updatedAt)}`
      : "";

    switch (status) {
      case STATUS.NOT_YET_STARTED:
        return (
          <Box component="span" sx={{ color: "gray" }}>
            Not yet submitted
          </Box>
        );
      case STATUS.SAVED_DRAFT:
        return "In Progress";
      case STATUS.SUBMITTED:
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
      case STATUS.SUBMITTED_LATE:
        return (
          <HoverLink
            href={`${PAGES.SUBMISSIONS}/${submissionId}`}
            wrap={true}
            variant="body2"
          >
            <Box component="span" sx={{ color: "error.main" }}>
              Submitted late {dateOn}
            </Box>
          </HoverLink>
        );
      default:
        return "Error";
    }
  };

  return (
    <TableRow>
      {/* Relation ID Column */}
      <TableCell>{data.relationId}</TableCell>

      {/* Evaluator Type Column */}
      <TableCell>
        <Box
          component="span"
          sx={{
            color: data.fromProject ? "primary.main" : "secondary.main",
            fontWeight: 600,
          }}
        >
          {data.fromProject ? "Team" : "Adviser"}
        </Box>
      </TableCell>

      {/* Evaluator Name Column */}
      <TableCell>
        {data.fromProject ? (
          <HoverLink href={`${PAGES.PROJECTS}/${data.fromProject.id}`}>
            {data.fromProject.teamName || data.fromProject.name}
          </HoverLink>
        ) : (
          <HoverLink href={`${PAGES.USERS}/${data.fromUser?.id}`}>
            {data.fromUser?.name}
          </HoverLink>
        )}
      </TableCell>

      {/* Evaluatee Name Column */}
      <TableCell>
        {data.toProject ? (
          <HoverLink href={`${PAGES.PROJECTS}/${data.toProject.id}`}>
            {data.toProject.teamName || data.toProject.name}
          </HoverLink>
        ) : (
          <HoverLink href={`${PAGES.USERS}/${data.toUser?.id}`}>
            {data.toUser?.name}
          </HoverLink>
        )}
      </TableCell>

      {/* Status Column(s) */}
      {deadline ? (
        <TableCell>
          {generateStatusCell(status, singleSub?.updatedAt, singleSub?.id)}
        </TableCell>
      ) : (
        evaluationDeadlines.map((evalDeadline) => {
          const isTeamRow = !!data.fromProject;
          const isAdviserRow = !!data.fromUser;

          const isApplicable =
            !evalDeadline.evaluatorType ||
            evalDeadline.evaluatorType === "Both" ||
            (evalDeadline.evaluatorType === "Team" && isTeamRow) ||
            (evalDeadline.evaluatorType === "Adviser" && isAdviserRow);

          if (!isApplicable) {
            return (
              <TableCell key={evalDeadline.id}>
                <Box
                  component="span"
                  sx={{ color: "text.disabled", fontStyle: "italic" }}
                >
                  N/A
                </Box>
              </TableCell>
            );
          }

          const sub = getSubForDeadline(evalDeadline.id);
          const cellStatus = sub
            ? generateSubmissionStatus({
                submissionId: sub.id,
                isDraft: false,
                updatedAt: sub.updatedAt,
                dueBy: evalDeadline.dueBy,
              })
            : STATUS.NOT_YET_STARTED;

          return (
            <TableCell key={evalDeadline.id}>
              {generateStatusCell(cellStatus, sub?.updatedAt, sub?.id)}
            </TableCell>
          );
        })
      )}
    </TableRow>
  );
};

export default EvaluationsRow;

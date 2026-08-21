import { ChangeEvent, FC, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  MenuItem,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import CalendarIcon from "@mui/icons-material/CalendarToday";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { CSVDownload } from "react-csv";

import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import { toSingleLineCsvText } from "@/helpers/csv";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import { GetAdministratorCollatedMilestoneSubmissionsResponse } from "@/types/api";
import { Deadline, QUESTION_TYPE } from "@/types/deadlines";
import { SUBMISSION_STATUS } from "@/types/submissions";

type MDeadline =
  GetAdministratorCollatedMilestoneSubmissionsResponse["collated"][number];
type EDeadline =
  GetAdministratorCollatedMilestoneSubmissionsResponse["evaluationCollated"][number];

type Props = {
  collated: MDeadline[];
  evaluationCollated: EDeadline[];
  milestoneDeadlines: Deadline[];
  selectedMilestoneDeadline: Deadline | null;
  handleSelectedMilestoneDeadlineChange: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  selectedSubmissionStatus: SUBMISSION_STATUS;
  handleSubmissionStatusChange: (event: ChangeEvent<HTMLInputElement>) => void;
  searchTextInput: string;
  handleSearchInputChange: (event: ChangeEvent<HTMLInputElement>) => void;
  viewAnonymousAnswers: boolean;
  handleToggleViewAnonymousAnswers: () => void;
  isLoading: boolean;
  viewHasDropped: boolean;
  handleToggleViewDropped: () => void;
};

type Row = {
  projectId: number;
  milestoneId: number;
  milestoneName: string;
  teamName: string;
  projectName: string;
  submittedAt: string;
  submittedAtRaw?: string;
  answers: Record<string, string>;
};

type TooltipQuestion = {
  sectionName: string;
  sectionNumber: number;
  question: string;
  type: string;
  urlType?: string | null;
  isRequired: boolean;
};

type MilestoneColumn = {
  key: string;
  deadlineName: string;
  question: MDeadline["questions"][number];
};

type EvaluationColumn = {
  key: string;
  deadlineName: string;
  deadlineType: string;
  evaluatorType?: Deadline["evaluatorType"];
  question: EDeadline["questions"][number];
};

const formatAnswer = (answer?: string, submissionId?: number) =>
  answer?.trim() ? answer : submissionId ? "No answer" : "No submission";

const isStatusValue = (value: string) =>
  value === "No answer" || value === "No submission";

const parseCheckboxAnswer = (value: string) => {
  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.filter(Boolean).join(", ");
    }

    if (parsed && typeof parsed === "object") {
      return Object.entries(parsed)
        .filter(([, selected]) => selected === true)
        .map(([option]) => option)
        .join(", ");
    }
  } catch {
    return value;
  }

  return value;
};

const stripRichText = (value: string) =>
  value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseAnswerLine = (line: string) => {
  const matched = line.match(/^(Response \d+|[^:]+): (.+)$/);

  if (!matched) {
    return { prefix: "", value: line };
  }

  return {
    prefix: matched[1],
    value: matched[2],
  };
};

const formatAnswerValueForDisplay = (
  question: { type: string },
  value: string
) => {
  if (isStatusValue(value)) {
    return value;
  }

  switch (question.type) {
    case QUESTION_TYPE.CHECKBOXES: {
      const parsed = parseCheckboxAnswer(value);
      return parsed || "No answer";
    }

    case QUESTION_TYPE.RICH_TEXT_EDITOR: {
      const stripped = stripRichText(value);
      return stripped || "No answer";
    }

    default:
      return value;
  }
};

const formatAnswerText = (question: { type: string }, rawValue: string) =>
  rawValue
    .split("\n")
    .map((line) => {
      const { prefix, value } = parseAnswerLine(line);
      const formattedValue = formatAnswerValueForDisplay(question, value);
      return prefix ? `${prefix}: ${formattedValue}` : formattedValue;
    })
    .join("\n");

const isUrlValue = (value: string) => /^https?:\/\/\S+$/i.test(value.trim());

const questionTypeLabel = (question: {
  type: string;
  urlType?: string | null;
}) =>
  question.type === "Url" && question.urlType
    ? `URL ${question.urlType}`
    : question.type.replace(/([a-z])([A-Z])/g, "$1 $2");

const getQuestionTooltip = (deadlineLabel: string, question: TooltipQuestion) =>
  [
    `Deadline: ${deadlineLabel}`,
    `Question: ${question.question}`,
    `Type: ${questionTypeLabel(question)}`,
    `Section: ${question.sectionNumber}. ${question.sectionName}`,
    `Required: ${question.isRequired ? "Yes" : "No"}`,
  ].join("\n");

const bar = (segments: { value: number; color: string }[]) => (
  <Box
    sx={{
      display: "flex",
      height: 8,
      borderRadius: 999,
      overflow: "hidden",
      bgcolor: "grey.200",
    }}
  >
    {segments.map((segment, index) => (
      <Box
        key={`${segment.color}-${index}`}
        sx={{
          width: `${segment.value}%`,
          minWidth: segment.value > 0 ? 6 : 0,
          bgcolor: segment.color,
        }}
      />
    ))}
  </Box>
);

const buildRows = (collated: MDeadline[]) =>
  collated.flatMap(({ deadline, questions }) => {
    const rows = new Map<number, Row>();

    questions.forEach((question) => {
      question.responses.forEach((response) => {
        if (!rows.has(response.projectId)) {
          rows.set(response.projectId, {
            projectId: response.projectId,
            milestoneId: deadline.id,
            milestoneName: deadline.name,
            teamName: response.teamName,
            projectName: response.projectName,
            submittedAt: response.submittedAt
              ? isoDateToLocaleDateWithTime(response.submittedAt)
              : "No submission",
            submittedAtRaw: response.submittedAt,
            answers: {},
          });
        }

        const row = rows.get(response.projectId);
        if (!row) return;

        row.answers[`m-${question.questionId}`] = formatAnswer(
          response.answer,
          response.submissionId
        );
      });
    });

    return Array.from(rows.values());
  });

const mergeEvaluationAnswers = (evaluationCollated: EDeadline[]) => {
  const answersByProject = new Map<number, Record<string, string>>();

  evaluationCollated.forEach(({ deadline, questions }) => {
    questions.forEach((question) => {
      const key = `e-${deadline.id}-${question.questionId}`;
      const grouped = new Map<
        number,
        { rank: number; label: string; value: string; time?: string }[]
      >();

      question.responses.forEach((response) => {
        const value = formatAnswer(response.answer, response.submissionId);
        const rank =
          value === "No submission" ? 2 : value === "No answer" ? 1 : 0;
        const label = question.isAnonymous
          ? ""
          : response.evaluatorName || response.evaluatorType;

        if (!grouped.has(response.evaluateeProjectId)) {
          grouped.set(response.evaluateeProjectId, []);
        }

        const groupedResponses = grouped.get(response.evaluateeProjectId);
        if (!groupedResponses) return;

        groupedResponses.push({
          rank,
          label,
          value,
          time: response.submittedAt,
        });
      });

      grouped.forEach((items, projectId) => {
        items.sort((left, right) => {
          if (left.rank !== right.rank) {
            return left.rank - right.rank;
          }

          return (
            (right.time ? new Date(right.time).getTime() : -1) -
            (left.time ? new Date(left.time).getTime() : -1)
          );
        });

        const merged = items
          .map((item, index) =>
            question.isAnonymous
              ? `Response ${index + 1}: ${item.value}`
              : `${item.label}: ${item.value}`
          )
          .join("\n");

        if (!answersByProject.has(projectId)) {
          answersByProject.set(projectId, {});
        }

        const projectAnswers = answersByProject.get(projectId);
        if (!projectAnswers) return;

        projectAnswers[key] = merged;
      });
    });
  });

  return answersByProject;
};

const rankAnonymousRow = (row: Row, columns: { key: string }[]) => {
  const values = columns.map(
    (column) => row.answers[column.key] ?? "No answer"
  );
  const hasFilledAnswer = values.some(
    (value) => value !== "No answer" && value !== "No submission"
  );

  if (hasFilledAnswer) return 0;
  if (row.submittedAt !== "No submission") return 1;
  return 2;
};

const CollatedMilestoneResponsesTable: FC<Props> = ({
  collated,
  evaluationCollated,
  milestoneDeadlines,
  selectedMilestoneDeadline,
  handleSelectedMilestoneDeadlineChange,
  selectedSubmissionStatus,
  handleSubmissionStatusChange,
  searchTextInput,
  handleSearchInputChange,
  viewAnonymousAnswers,
  handleToggleViewAnonymousAnswers,
  isLoading,
  viewHasDropped,
  handleToggleViewDropped,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [csvData, setCsvData] = useState<Record<string, string | number>[]>([]);

  const milestoneColumns = useMemo<MilestoneColumn[]>(
    () =>
      collated.flatMap(({ deadline, questions }) =>
        questions.map((question) => ({
          key: `m-${question.questionId}`,
          deadlineName: deadline.name,
          question,
        }))
      ),
    [collated]
  );

  const evaluationColumns = useMemo<EvaluationColumn[]>(
    () =>
      selectedMilestoneDeadline && !viewAnonymousAnswers
        ? evaluationCollated.flatMap(({ deadline, questions }) =>
            questions.map((question) => ({
              key: `e-${deadline.id}-${question.questionId}`,
              deadlineName: deadline.name,
              deadlineType: deadline.type,
              evaluatorType: deadline.evaluatorType,
              question,
            }))
          )
        : [],
    [evaluationCollated, selectedMilestoneDeadline, viewAnonymousAnswers]
  );

  const rows = useMemo(() => buildRows(collated), [collated]);
  const evaluationAnswers = useMemo(
    () =>
      viewAnonymousAnswers
        ? new Map<number, Record<string, string>>()
        : mergeEvaluationAnswers(evaluationCollated),
    [evaluationCollated, viewAnonymousAnswers]
  );

  const displayRows = useMemo(() => {
    const mergedRows = rows.map((row) => ({
      ...row,
      answers: {
        ...row.answers,
        ...(evaluationAnswers.get(row.projectId) ?? {}),
      },
    }));

    if (!viewAnonymousAnswers) {
      return mergedRows;
    }

    return [...mergedRows].sort((left, right) => {
      const diff =
        rankAnonymousRow(left, [...milestoneColumns, ...evaluationColumns]) -
        rankAnonymousRow(right, [...milestoneColumns, ...evaluationColumns]);

      if (diff !== 0) {
        return diff;
      }

      return (
        (right.submittedAtRaw ? new Date(right.submittedAtRaw).getTime() : -1) -
        (left.submittedAtRaw ? new Date(left.submittedAtRaw).getTime() : -1)
      );
    });
  }, [
    evaluationAnswers,
    evaluationColumns,
    milestoneColumns,
    rows,
    viewAnonymousAnswers,
  ]);

  const summaryCards = useMemo(
    () =>
      collated
        .map(({ deadline, questions }) => {
          const deadlineRows = rows.filter(
            (row) => row.milestoneId === deadline.id
          );
          const total = deadlineRows.length;
          const submitted = deadlineRows.filter(
            (row) =>
              row.submittedAtRaw &&
              new Date(row.submittedAtRaw).getTime() <=
                new Date(deadline.dueBy).getTime()
          ).length;
          const late = deadlineRows.filter(
            (row) =>
              row.submittedAtRaw &&
              new Date(row.submittedAtRaw).getTime() >
                new Date(deadline.dueBy).getTime()
          ).length;

          return {
            id: deadline.id,
            name: deadline.name,
            dueBy: deadline.dueBy,
            total,
            submitted,
            late,
            missing: total - submitted - late,
            questions: questions.length,
          };
        })
        .filter((card) => card.total > 0 || card.questions > 0),
    [collated, rows]
  );

  const questionCards = useMemo(() => {
    if (!selectedMilestoneDeadline) return [];

    const deadline = collated.find(
      (item) => item.deadline.id === selectedMilestoneDeadline.id
    );

    if (!deadline) return [];

    return deadline.questions.map((question) => {
      let answered = 0;
      let blank = 0;
      let noSubmission = 0;

      question.responses.forEach((response) => {
        const value = formatAnswer(response.answer, response.submissionId);
        if (value === "No submission") noSubmission++;
        else if (value === "No answer") blank++;
        else answered++;
      });

      return {
        id: question.questionId,
        num: question.questionNumber,
        title: question.question,
        required: question.isRequired,
        answered,
        blank,
        noSubmission,
        total: question.responses.length,
      };
    });
  }, [collated, selectedMilestoneDeadline]);

  const exportCsv = async () => {
    setIsExporting(true);

    setCsvData(
      displayRows.map((row, index) => {
        const csvRow: Record<string, string | number> = {
          milestoneId: row.milestoneId,
          milestoneName: row.milestoneName,
        };

        if (viewAnonymousAnswers) {
          csvRow.response = `Response ${index + 1}`;
        } else {
          csvRow.teamName = row.teamName;
          csvRow.projectName = row.projectName;
        }

        milestoneColumns.forEach(({ key, deadlineName, question }) => {
          const header =
            collated.length > 1
              ? `Milestone.${deadlineName}\nQ${question.questionNumber}. ${question.question}`
              : `Q${question.questionNumber}. ${question.question}`;
          csvRow[toSingleLineCsvText(header)] = toSingleLineCsvText(
            formatAnswerText(question, row.answers[key] ?? "No answer")
          );
        });

        evaluationColumns.forEach(
          ({ key, deadlineType, deadlineName, evaluatorType, question }) => {
            const header = `${deadlineType}.${deadlineName}\nQ${
              question.questionNumber
            }. ${question.question}.from ${String(
              evaluatorType ?? "Team"
            ).toLowerCase()}`;

            csvRow[toSingleLineCsvText(header)] = toSingleLineCsvText(
              formatAnswerText(question, row.answers[key] ?? "No submission")
            );
          }
        );

        return csvRow;
      })
    );

    setIsExporting(false);
  };

  const renderQuestionHeader = (
    label: string,
    title: string,
    tooltipLabel: string,
    question: TooltipQuestion,
    sublabel?: string
  ) => (
    <Stack spacing={0.5}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{
          fontWeight: 600,
          whiteSpace: "normal",
          overflowWrap: "anywhere",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5 }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
            whiteSpace: "normal",
            overflowWrap: "anywhere",
          }}
        >
          {title}
        </Typography>
        <Tooltip
          title={
            <Box sx={{ whiteSpace: "pre-line" }}>
              {getQuestionTooltip(tooltipLabel, question)}
            </Box>
          }
          placement="top"
        >
          <IconButton size="small" sx={{ p: 0.25, flexShrink: 0 }}>
            <InfoOutlinedIcon fontSize="inherit" />
          </IconButton>
        </Tooltip>
      </Box>
      {sublabel ? (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ whiteSpace: "normal", overflowWrap: "anywhere" }}
        >
          {sublabel}
        </Typography>
      ) : null}
    </Stack>
  );

  const renderAnswerCell = (
    question: MilestoneColumn["question"] | EvaluationColumn["question"],
    value: string
  ) => {
    const lines = value.split("\n");

    return (
      <Stack spacing={0.5}>
        {lines.map((line, index) => {
          const { prefix, value: rawValue } = parseAnswerLine(line);
          const formattedValue = formatAnswerValueForDisplay(
            question,
            rawValue
          );
          const muted = formattedValue === "No submission";

          if (question.type === QUESTION_TYPE.URL && isUrlValue(rawValue)) {
            return (
              <Box
                key={`${question.questionId}-${index}`}
                sx={{
                  color: muted ? "text.secondary" : "text.primary",
                  overflowWrap: "anywhere",
                }}
              >
                {prefix ? (
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ fontWeight: 600 }}
                  >
                    {`${prefix}: `}
                  </Typography>
                ) : null}
                <Link
                  href={rawValue}
                  target="_blank"
                  rel="noreferrer"
                  underline="hover"
                  sx={{ overflowWrap: "anywhere" }}
                >
                  {rawValue}
                </Link>
              </Box>
            );
          }

          return (
            <Typography
              key={`${question.questionId}-${index}`}
              variant="body2"
              color={muted ? "text.secondary" : "text.primary"}
              sx={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}
            >
              {prefix ? `${prefix}: ${formattedValue}` : formattedValue}
            </Typography>
          );
        })}
      </Stack>
    );
  };

  return (
    <Stack gap={2}>
      <Stack direction="row" gap="0.5rem" alignItems="center" flexWrap="wrap">
        <TextField
          label="Milestone"
          value={
            selectedMilestoneDeadline
              ? JSON.stringify(selectedMilestoneDeadline)
              : "0"
          }
          onChange={handleSelectedMilestoneDeadlineChange}
          select
          size="small"
        >
          <MenuItem value={"0"}>All Milestones</MenuItem>
          {milestoneDeadlines.map((deadline) => (
            <MenuItem
              key={deadline.id}
              value={JSON.stringify(deadline)}
            >{`${deadline.id}: ${deadline.name}`}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Search Project Name"
          value={searchTextInput}
          onChange={handleSearchInputChange}
          size="small"
          disabled={viewAnonymousAnswers}
          sx={{ minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {selectedMilestoneDeadline ? (
          <TextField
            label="Submission Status"
            value={selectedSubmissionStatus}
            onChange={handleSubmissionStatusChange}
            select
            size="small"
            sx={{ width: "fit-content" }}
          >
            {Object.values(SUBMISSION_STATUS).map((status) => (
              <MenuItem key={status} value={status}>
                {status === SUBMISSION_STATUS.ALL
                  ? "All Submissions"
                  : status.split("_").join(" ")}
              </MenuItem>
            ))}
          </TextField>
        ) : null}

        <Box
          sx={{
            ml: "auto",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                size="small"
                checked={viewAnonymousAnswers}
                onChange={handleToggleViewAnonymousAnswers}
              />
            }
            label="View Anonymous Answers"
            labelPlacement="end"
          />
          <FormControlLabel
            control={
              <Switch
                color="secondary"
                size="small"
                checked={viewHasDropped}
                onChange={handleToggleViewDropped}
              />
            }
            label="View Dropped Teams"
            labelPlacement="end"
          />
          <LoadingButton
            variant="outlined"
            loading={isExporting}
            onClick={exportCsv}
            startIcon={<FileDownloadOutlinedIcon />}
            disabled={!displayRows.length}
          >
            Export CSV
          </LoadingButton>
        </Box>

        {csvData.length ? (
          <CSVDownload
            filename={`Collated milestone responses ${isoDateToLocaleDateWithTime(
              new Date().toISOString()
            )}`}
            data={csvData}
            target="_blank"
          />
        ) : null}
      </Stack>

      {!isLoading &&
      selectedMilestoneDeadline === null &&
      summaryCards.length ? (
        <Grid container spacing={3}>
          {summaryCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Typography variant="h5">{card.name}</Typography>
                    <Chip
                      label={`${(
                        ((card.submitted + card.late) / (card.total || 1)) *
                          100 || 0
                      ).toFixed(0)}% Complete`}
                      color={
                        card.total &&
                        (card.submitted + card.late) / card.total >= 0.7
                          ? "success"
                          : card.total &&
                            (card.submitted + card.late) / card.total >= 0.3
                          ? "warning"
                          : "error"
                      }
                    />
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <CalendarIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      Due {new Date(card.dueBy).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    Overall Progress
                  </Typography>
                  {bar([
                    {
                      value: card.total
                        ? (card.submitted / card.total) * 100
                        : 0,
                      color: "#2e7d32",
                    },
                    {
                      value: card.total ? (card.late / card.total) * 100 : 0,
                      color: "#ed6c02",
                    },
                    {
                      value: card.total ? (card.missing / card.total) * 100 : 0,
                      color: "#bdbdbd",
                    },
                  ])}
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="success.main">
                        {card.submitted}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Submitted
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="warning.main">
                        {card.late}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Late
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="error.main">
                        {card.missing}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Missing
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}

      {!isLoading && selectedMilestoneDeadline && questionCards.length ? (
        <Grid container spacing={3}>
          {questionCards.map((card) => (
            <Grid item xs={12} sm={6} md={4} key={card.id}>
              <Card>
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 1,
                    }}
                  >
                    <Typography variant="h6">Q{card.num}</Typography>
                    <Chip
                      label={card.required ? "Required" : "Optional"}
                      color={card.required ? "secondary" : "default"}
                      size="small"
                    />
                  </Box>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, minHeight: 44 }}
                  >
                    {card.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Question Completion
                  </Typography>
                  {bar([
                    {
                      value: card.total
                        ? (card.answered / card.total) * 100
                        : 0,
                      color: "#2e7d32",
                    },
                    {
                      value: card.total ? (card.blank / card.total) * 100 : 0,
                      color: "#ed6c02",
                    },
                    {
                      value: card.total
                        ? (card.noSubmission / card.total) * 100
                        : 0,
                      color: "#bdbdbd",
                    },
                  ])}
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="success.main">
                        {card.answered}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Answered
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="warning.main">
                        {card.blank}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Blank
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="h4" color="text.secondary">
                        {card.noSubmission}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        No Submission
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : null}

      {isLoading ? (
        <Box sx={{ display: "grid", placeItems: "center", minHeight: 180 }}>
          <LoadingSpinner size={50} />
        </Box>
      ) : !displayRows.length ? (
        <Box
          sx={{
            border: "1px dashed",
            borderColor: "divider",
            borderRadius: 2,
            p: 3,
            bgcolor: "background.paper",
          }}
        >
          <Typography color="text.secondary">
            No collated milestone responses found.
          </Typography>
        </Box>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {viewAnonymousAnswers ? (
                  <TableCell>Response</TableCell>
                ) : (
                  <>
                    <TableCell>Team Name</TableCell>
                    <TableCell>Project Name</TableCell>
                  </>
                )}
                {milestoneColumns.map(({ deadlineName, question }) => (
                  <TableCell
                    key={`m-head-${question.questionId}`}
                    sx={{ minWidth: 260, verticalAlign: "top" }}
                  >
                    {renderQuestionHeader(
                      selectedMilestoneDeadline
                        ? `Q${question.questionNumber}`
                        : `Milestone.${deadlineName}`,
                      selectedMilestoneDeadline
                        ? question.question
                        : `Q${question.questionNumber}. ${question.question}`,
                      deadlineName,
                      question
                    )}
                  </TableCell>
                ))}
                {selectedMilestoneDeadline
                  ? evaluationColumns.map(
                      ({
                        deadlineType,
                        deadlineName,
                        evaluatorType,
                        question,
                      }) => (
                        <TableCell
                          key={`e-head-${deadlineName}-${question.questionId}`}
                          sx={{ minWidth: 260, verticalAlign: "top" }}
                        >
                          {renderQuestionHeader(
                            `${deadlineType}.${deadlineName}`,
                            `Q${question.questionNumber}. ${question.question}`,
                            `${deadlineType}.${deadlineName}`,
                            question,
                            `from ${String(
                              evaluatorType ?? "Team"
                            ).toLowerCase()}`
                          )}
                        </TableCell>
                      )
                    )
                  : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayRows.map((row, index) => (
                <TableRow key={`${row.milestoneId}-${row.projectId}`}>
                  {viewAnonymousAnswers ? (
                    <TableCell>{`Response ${index + 1}`}</TableCell>
                  ) : (
                    <>
                      <TableCell>{row.teamName}</TableCell>
                      <TableCell>{row.projectName}</TableCell>
                    </>
                  )}
                  {milestoneColumns.map(({ key, question }) => {
                    const value = row.answers[key] ?? "No answer";
                    return (
                      <TableCell
                        key={`${row.projectId}-${key}-${question.questionId}`}
                        sx={{
                          verticalAlign: "top",
                          ...(value === "No submission"
                            ? { color: "text.secondary" }
                            : {}),
                        }}
                      >
                        {renderAnswerCell(question, value)}
                      </TableCell>
                    );
                  })}
                  {selectedMilestoneDeadline
                    ? evaluationColumns.map(({ key, question }) => {
                        const value = row.answers[key] ?? "No submission";
                        return (
                          <TableCell
                            key={`${row.projectId}-${key}-${question.questionId}`}
                            sx={{
                              verticalAlign: "top",
                              ...(value === "No submission"
                                ? { color: "text.secondary" }
                                : {}),
                            }}
                          >
                            {renderAnswerCell(question, value)}
                          </TableCell>
                        );
                      })
                    : null}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};

export default CollatedMilestoneResponsesTable;

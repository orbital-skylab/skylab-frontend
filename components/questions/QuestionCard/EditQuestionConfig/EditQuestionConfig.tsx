import { ChangeEvent, FC } from "react";
import { Delete, InfoOutlined } from "@mui/icons-material";
import {
  TextField,
  MenuItem,
  Stack,
  IconButton,
  Switch,
  FormControlLabel,
  Tooltip,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import { splitOnCapital } from "@/helpers/string";
import {
  LeanQuestion,
  PAPER_FORMAT,
  QUESTION_TYPE,
  URL_TYPE,
} from "@/types/deadlines";

type Props = {
  question: LeanQuestion;
  setQuestion: (question?: LeanQuestion) => void;
};

const IMAGE_VALIDATION_MODE = {
  NONE: "NONE",
  A1: "A1",
  A4: "A4",
} as const;

type ImageValidationMode =
  typeof IMAGE_VALIDATION_MODE[keyof typeof IMAGE_VALIDATION_MODE];

const getImageValidationMode = (
  allowedPaperFormats?: PAPER_FORMAT[]
): ImageValidationMode => {
  if (!allowedPaperFormats?.length) return IMAGE_VALIDATION_MODE.NONE;
  if (allowedPaperFormats.includes(PAPER_FORMAT.A1)) {
    return IMAGE_VALIDATION_MODE.A1;
  }
  return IMAGE_VALIDATION_MODE.A4;
};

const getAllowedPaperFormatsForMode = (
  mode: ImageValidationMode
): PAPER_FORMAT[] => {
  switch (mode) {
    case IMAGE_VALIDATION_MODE.A1:
      return [PAPER_FORMAT.A1];
    case IMAGE_VALIDATION_MODE.A4:
      return [PAPER_FORMAT.A4];
    default:
      return [];
  }
};

const getVideoValidationHelp = (
  maxFileSizeBytes?: number,
  minDurationSeconds?: number,
  maxDurationSeconds?: number
): string => {
  const parts: string[] = [
    "The link must be readable and downloadable for verification.",
  ];

  if (maxFileSizeBytes) {
    parts.push(`Maximum file size: ${bytesToMbDisplay(maxFileSizeBytes)} MB.`);
  }

  if (minDurationSeconds != null || maxDurationSeconds != null) {
    if (minDurationSeconds != null && maxDurationSeconds != null) {
      parts.push(
        `Allowed duration: ${minDurationSeconds}s to ${maxDurationSeconds}s.`
      );
    } else if (minDurationSeconds != null) {
      parts.push(`Minimum duration: ${minDurationSeconds}s.`);
    } else if (maxDurationSeconds != null) {
      parts.push(`Maximum duration: ${maxDurationSeconds}s.`);
    }
  }

  return parts.join(" ");
};

const bytesToMbDisplay = (bytes?: number): string => {
  if (bytes == null) return "";
  return String(bytes / (1024 * 1024));
};

const mbToBytes = (mb: number): number => Math.round(mb * 1024 * 1024);

const EditQuestionConfig: FC<Props> = ({ question, setQuestion }) => {
  const rules = question.urlValidationRules ?? {};
  const imageValidationMode = getImageValidationMode(rules.allowedPaperFormats);

  const updateQuestion = (patch: Partial<LeanQuestion>) => {
    setQuestion({
      ...question,
      ...patch,
    });
  };

  const updateUrlValidationRules = (
    patch: Partial<NonNullable<LeanQuestion["urlValidationRules"]>>
  ) => {
    setQuestion({
      ...question,
      urlValidationRules: {
        ...(question.urlValidationRules ?? {}),
        ...patch,
      },
    });
  };

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newType = e.target.value as QUESTION_TYPE;

    const newQuestion: LeanQuestion = {
      ...question,
      type: newType,
      urlType:
        newType === QUESTION_TYPE.URL
          ? question.urlType ?? URL_TYPE.GENERIC
          : undefined,
      urlValidationRules:
        newType === QUESTION_TYPE.URL ? question.urlValidationRules : undefined,
    };

    setQuestion(newQuestion);
  };

  const handleUrlTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newUrlType = e.target.value as URL_TYPE;

    let nextRules = question.urlValidationRules ?? {};

    if (newUrlType === URL_TYPE.GENERIC) {
      nextRules = {};
    }

    if (newUrlType === URL_TYPE.IMAGE) {
      nextRules = {
        maxFileSizeBytes: nextRules.maxFileSizeBytes,
        allowedPaperFormats: nextRules.allowedPaperFormats ?? [],
      };
    }

    if (newUrlType === URL_TYPE.VIDEO) {
      nextRules = {
        maxFileSizeBytes: nextRules.maxFileSizeBytes,
        minDurationSeconds: nextRules.minDurationSeconds,
        maxDurationSeconds: nextRules.maxDurationSeconds,
      };
    }

    setQuestion({
      ...question,
      urlType: newUrlType,
      urlValidationRules: nextRules,
    });
  };

  const handleToggleAnonymous = () => {
    updateQuestion({ isAnonymous: !question.isAnonymous });
  };

  const handleToggleRequired = () => {
    updateQuestion({ isRequired: !question.isRequired });
  };

  const handleDeleteQuestion = () => {
    setQuestion();
  };

  const handleNumberRuleChange =
    (field: keyof NonNullable<LeanQuestion["urlValidationRules"]>) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;

      if (raw === "") {
        updateUrlValidationRules({ [field]: undefined });
        return;
      }

      const value = Number(raw);

      updateUrlValidationRules({
        [field]: Number.isNaN(value) ? undefined : value,
      });
    };

  const handleMaxFileSizeMbChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (raw === "") {
      updateUrlValidationRules({ maxFileSizeBytes: undefined });
      return;
    }

    const value = Number(raw);

    updateUrlValidationRules({
      maxFileSizeBytes: Number.isNaN(value) ? undefined : mbToBytes(value),
    });
  };

  return (
    <Stack sx={{ width: "40%" }} gap={2}>
      <TextField
        className="question-type-select"
        label="Question type"
        value={question.type}
        onChange={handleTypeChange}
        select
        size="small"
        fullWidth
      >
        {Object.values(QUESTION_TYPE).map((questionType) => (
          <MenuItem key={questionType} value={questionType}>
            {splitOnCapital(questionType)}
          </MenuItem>
        ))}
      </TextField>

      {question.type === QUESTION_TYPE.URL && (
        <>
          <TextField
            className="url-type-select"
            label="URL type"
            value={question.urlType ?? URL_TYPE.GENERIC}
            onChange={handleUrlTypeChange}
            select
            size="small"
            fullWidth
          >
            {Object.values(URL_TYPE).map((urlType) => (
              <MenuItem key={urlType} value={urlType}>
                {splitOnCapital(urlType)}
              </MenuItem>
            ))}
          </TextField>

          {(question.urlType === URL_TYPE.IMAGE ||
            question.urlType === URL_TYPE.VIDEO) && (
            <Box
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                backgroundColor: "background.paper",
              }}
            >
              <Stack gap={2}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Validation rules
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Configure what counts as a valid{" "}
                    {question.urlType?.toLowerCase()} submission.
                  </Typography>
                </Box>

                <TextField
                  label="Max file size (MB)"
                  type="number"
                  size="small"
                  fullWidth
                  value={bytesToMbDisplay(rules.maxFileSizeBytes)}
                  onChange={handleMaxFileSizeMbChange}
                  inputProps={{ min: 0 }}
                />

                {question.urlType === URL_TYPE.IMAGE && (
                  <>
                    <Divider flexItem />

                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Image validation
                    </Typography>

                    <Box display="flex" alignItems="flex-start" gap={1}>
                      <TextField
                        label="Validation mode"
                        select
                        size="small"
                        fullWidth
                        value={imageValidationMode}
                        onChange={(e) =>
                          updateUrlValidationRules({
                            allowedPaperFormats: getAllowedPaperFormatsForMode(
                              e.target.value as ImageValidationMode
                            ),
                          })
                        }
                      >
                        <MenuItem value={IMAGE_VALIDATION_MODE.NONE}>
                          No validation
                        </MenuItem>
                        <MenuItem value={IMAGE_VALIDATION_MODE.A1}>A1</MenuItem>
                        <MenuItem value={IMAGE_VALIDATION_MODE.A4}>A4</MenuItem>
                      </TextField>

                      <Tooltip
                        title="Choose A1 or A4 to require image files that match that A-series poster format. Choose No validation to accept any image file. The link still needs to be readable and downloadable."
                        placement="top"
                      >
                        <IconButton
                          size="small"
                          sx={{ mt: 0.5 }}
                          aria-label="Image validation help"
                        >
                          <InfoOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </>
                )}

                {question.urlType === URL_TYPE.VIDEO && (
                  <>
                    <Divider flexItem />

                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Video requirements
                      </Typography>
                      <Tooltip
                        title={getVideoValidationHelp(
                          rules.maxFileSizeBytes,
                          rules.minDurationSeconds,
                          rules.maxDurationSeconds
                        )}
                        placement="top"
                      >
                        <IconButton
                          size="small"
                          aria-label="Video validation help"
                        >
                          <InfoOutlined fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Stack direction="row" spacing={2}>
                      <TextField
                        label="Min duration (seconds)"
                        type="number"
                        size="small"
                        fullWidth
                        value={rules.minDurationSeconds ?? ""}
                        onChange={handleNumberRuleChange("minDurationSeconds")}
                        inputProps={{ min: 0 }}
                      />
                      <TextField
                        label="Max duration (seconds)"
                        type="number"
                        size="small"
                        fullWidth
                        value={rules.maxDurationSeconds ?? ""}
                        onChange={handleNumberRuleChange("maxDurationSeconds")}
                        inputProps={{ min: 0 }}
                      />
                    </Stack>
                  </>
                )}
              </Stack>
            </Box>
          )}
        </>
      )}

      <Stack
        justifyContent="space-between"
        marginTop="auto"
        flexDirection="row"
      >
        <Tooltip
          title="An anonymous question means that the receiver of the question will not be able to see who it is from"
          placement="top"
        >
          <FormControlLabel
            value={question.isAnonymous}
            onClick={handleToggleAnonymous}
            checked={question.isAnonymous}
            control={<Switch color="secondary" size="small" />}
            label="Anonymous"
            labelPlacement="start"
          />
        </Tooltip>

        <Tooltip
          title="A required question means that the receiver of the question must answer this question before submitting"
          placement="top"
        >
          <FormControlLabel
            value={question.isRequired}
            onClick={handleToggleRequired}
            checked={question.isRequired}
            control={<Switch color="secondary" size="small" />}
            label="Required"
            labelPlacement="start"
          />
        </Tooltip>

        <Tooltip title="Delete question" placement="top">
          <IconButton color="error" onClick={handleDeleteQuestion}>
            <Delete />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
};

export default EditQuestionConfig;

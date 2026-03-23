import { ChangeEvent, FC, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ImageIcon from "@mui/icons-material/Image";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import VideocamIcon from "@mui/icons-material/Videocam";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import QuestionAndDesc from "../QuestionAndDesc/QuestionAndDesc";
import {
  LeanQuestion,
  Option,
  Question,
  URL_TYPE,
  UrlValidationRules,
} from "@/types/deadlines";
import { validateUrl } from "@/helpers/string";
import useApiCall from "@/hooks/useApiCall";
import { HTTP_METHOD } from "@/types/api";
import {
  QuestionVerificationState,
  VerificationResponse,
  VerifiedFile,
} from "../../QuestionSectionsList/QuestionSectionsList";

type Props = {
  question: LeanQuestion | Question;
  answer: Option;
  setAnswer: (newAnswer: string) => void;
  isReadonly: boolean;
  hasError?: boolean;
  errorMessage?: string;
  onClearError?: () => void;
  verificationResult?: QuestionVerificationState;
  setVerificationResult?: (result: QuestionVerificationState) => void;
};

type DriveFormatCheckResult = {
  isReady: boolean;
  message: string;
};

const extractGoogleDriveFileId = (url: string): string | null => {
  const patterns = [
    /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /docs\.google\.com\/[^/]+\/d\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

const isGoogleDriveUrl = (url: string): boolean => {
  return /(?:drive|docs)\.google\.com/.test(url);
};

const checkDriveLinkFormat = (input: string): DriveFormatCheckResult => {
  const trimmed = input.trim();

  if (!trimmed) {
    return {
      isReady: false,
      message: "",
    };
  }

  if (!isGoogleDriveUrl(trimmed)) {
    return {
      isReady: false,
      message: "Not a Google Drive link",
    };
  }

  const fileId = extractGoogleDriveFileId(trimmed);

  if (!fileId) {
    return {
      isReady: false,
      message: "Link looks incomplete or invalid",
    };
  }

  return {
    isReady: true,
    message: "Ready to verify",
  };
};

const formatBytes = (bytes: number | null | undefined): string => {
  if (bytes == null || Number.isNaN(bytes)) return "Unknown size";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let value = bytes;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(value >= 10 || unitIndex === 0 ? 0 : 1)} ${
    units[unitIndex]
  }`;
};

const formatDuration = (durationMillis?: number): string => {
  if (!durationMillis || Number.isNaN(durationMillis)) return "-";

  const totalSeconds = Math.floor(durationMillis / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

const MetadataRow = ({ label, value }: { label: string; value: string }) => (
  <Box display="flex" justifyContent="space-between" gap={2}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography
      variant="caption"
      sx={{ fontWeight: 500, textAlign: "right", wordBreak: "break-word" }}
    >
      {value}
    </Typography>
  </Box>
);

const getPaperFormatGuidance = (rules?: UrlValidationRules): string | null => {
  if (!rules?.allowedPaperFormats?.length) return null;

  return `Accepted format: ${rules.allowedPaperFormats.join(
    "/"
  )}. Submit an image file, and we will verify that the Drive link is accessible and the poster format matches the configured A-series requirement.`;
};

const getVideoGuidance = (rules?: UrlValidationRules): string | null => {
  if (
    !rules?.maxFileSizeBytes &&
    rules?.minDurationSeconds == null &&
    rules?.maxDurationSeconds == null
  ) {
    return null;
  }

  const parts: string[] = [
    "We will verify that the Drive link is accessible and downloadable.",
  ];

  if (rules?.maxFileSizeBytes) {
    parts.push(`Maximum file size: ${formatBytes(rules.maxFileSizeBytes)}.`);
  }

  if (rules?.minDurationSeconds != null && rules?.maxDurationSeconds != null) {
    parts.push(
      `Allowed duration: ${rules.minDurationSeconds}s to ${rules.maxDurationSeconds}s.`
    );
  } else if (rules?.minDurationSeconds != null) {
    parts.push(`Minimum duration: ${rules.minDurationSeconds}s.`);
  } else if (rules?.maxDurationSeconds != null) {
    parts.push(`Maximum duration: ${rules.maxDurationSeconds}s.`);
  }

  return parts.join(" ");
};

const UrlQuestion: FC<Props> = ({
  question,
  answer,
  setAnswer,
  isReadonly,
  hasError = false,
  errorMessage,
  onClearError,
  verificationResult,
  setVerificationResult,
}) => {
  const [touched, setTouched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const effectiveUrlType = question.urlType ?? URL_TYPE.GENERIC;
  const requiresDriveValidation =
    effectiveUrlType === URL_TYPE.IMAGE || effectiveUrlType === URL_TYPE.VIDEO;

  const trimmedAnswer = String(answer ?? "").trim();

  const driveFormatCheck = useMemo(
    () => checkDriveLinkFormat(trimmedAnswer),
    [trimmedAnswer]
  );

  const isVerified = verificationResult?.verified ?? false;
  const verifyMessage = verificationResult?.message ?? "";
  const verifiedFile: VerifiedFile | null = verificationResult?.file ?? null;
  const validationErrors = verificationResult?.validationErrors ?? [];

  const isUrlFormatInvalid =
    touched && trimmedAnswer !== "" && !validateUrl(trimmedAnswer);

  const isDriveUrlInvalid =
    touched &&
    trimmedAnswer !== "" &&
    requiresDriveValidation &&
    !driveFormatCheck.isReady;

  const helperText =
    errorMessage ||
    (isUrlFormatInvalid && "Please enter a valid URL") ||
    (isDriveUrlInvalid &&
      "Please enter a valid Google Drive file link for this question") ||
    (requiresDriveValidation &&
      trimmedAnswer !== "" &&
      !isVerified &&
      !verifyMessage &&
      !isUrlFormatInvalid &&
      driveFormatCheck.message) ||
    "";

  const verificationState: "idle" | "success" | "warning" | "error" =
    !verifyMessage && !verifiedFile
      ? "idle"
      : isVerified
      ? "success"
      : verifiedFile
      ? "warning"
      : "error";

  const showRedBorder =
    Boolean(hasError) ||
    Boolean(isUrlFormatInvalid) ||
    Boolean(isDriveUrlInvalid) ||
    verificationState === "error" ||
    verificationState === "warning";

  const verifyDriveFile = useApiCall({
    method: HTTP_METHOD.POST,
    endpoint: "/submissions/verify-drive-file",
    requiresAuthorization: true,
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;

    setTouched(true);
    setAnswer(newValue);
    onClearError?.();

    setVerificationResult?.({
      verified: false,
      message: "",
      file: null,
      validationErrors: [],
    });
  };

  const buildVerifyPayload = (): {
    url: string;
    questionId?: number | string;
    urlType?: URL_TYPE;
    urlValidationRules?: UrlValidationRules;
  } => {
    if ("id" in question && question.id != null) {
      return {
        questionId: question.id,
        url: trimmedAnswer,
      };
    }

    return {
      url: trimmedAnswer,
      urlType: question.urlType,
      urlValidationRules: question.urlValidationRules,
    };
  };

  const handleVerify = async () => {
    if (
      !requiresDriveValidation ||
      !driveFormatCheck.isReady ||
      !trimmedAnswer
    ) {
      return;
    }

    try {
      setIsVerifying(true);

      const response = (await verifyDriveFile.call(
        buildVerifyPayload()
      )) as VerificationResponse;

      setVerificationResult?.({
        verified: Boolean(response?.verified),
        message: response?.message || "Unable to verify file",
        file: response?.file ?? null,
        validationErrors: response?.validation?.errors ?? [],
      });
    } catch {
      setVerificationResult?.({
        verified: false,
        message: "Something went wrong while verifying",
        file: null,
        validationErrors: [],
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const videoDuration = formatDuration(
    verifiedFile?.videoMetadata?.durationMillis
  );
  const paperFormatGuidance = getPaperFormatGuidance(
    question.urlValidationRules
  );
  const videoGuidance = getVideoGuidance(question.urlValidationRules);
  const inlineGuidance =
    effectiveUrlType === URL_TYPE.IMAGE ? paperFormatGuidance : videoGuidance;

  const statusConfig = {
    idle: {
      borderColor: "divider",
      backgroundColor: "background.paper",
      icon: null,
      textColour: "text.primary",
    },
    success: {
      borderColor: "success.main",
      backgroundColor: "success.50",
      icon: <CheckCircleIcon fontSize="small" color="success" />,
      textColour: "success.main",
    },
    warning: {
      borderColor: "warning.main",
      backgroundColor: "warning.50",
      icon: <WarningAmberIcon fontSize="small" color="warning" />,
      textColour: "warning.main",
    },
    error: {
      borderColor: "error.main",
      backgroundColor: "error.50",
      icon: <ErrorOutlineIcon fontSize="small" color="error" />,
      textColour: "error.main",
    },
  }[verificationState];

  return (
    <Stack className="url-question" spacing="0.75rem" sx={{ width: "100%" }}>
      <QuestionAndDesc question={question} questionType="URL" />

      {!isReadonly ? (
        <>
          <TextField
            className="url-input"
            value={answer ?? ""}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            size="small"
            type="url"
            placeholder="Your URL here"
            error={showRedBorder}
            helperText={helperText}
            fullWidth
            sx={{
              "& .MuiOutlinedInput-root": {
                backgroundColor: "background.paper",
              },
            }}
            InputProps={{
              endAdornment: requiresDriveValidation ? (
                <InputAdornment position="end">
                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    {inlineGuidance && (
                      <Tooltip title={inlineGuidance} placement="top">
                        <IconButton
                          size="small"
                          aria-label="Validation details"
                        >
                          <InfoOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}

                    {isVerifying ? (
                      <CircularProgress size={18} />
                    ) : isVerified ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <Button
                        onClick={handleVerify}
                        size="small"
                        variant="text"
                        disabled={
                          isVerifying ||
                          isUrlFormatInvalid ||
                          !driveFormatCheck.isReady ||
                          !trimmedAnswer
                        }
                      >
                        Verify
                      </Button>
                    )}
                  </Stack>
                </InputAdornment>
              ) : null,
            }}
          />

          {verifiedFile && (
            <Box
              sx={{
                border: "1px solid",
                borderColor: statusConfig.borderColor,
                borderRadius: 2,
                p: 1.5,
                backgroundColor: statusConfig.backgroundColor,
              }}
            >
              <Stack spacing={1.25}>
                <Box display="flex" alignItems="center" gap={1}>
                  {statusConfig.icon}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      color: statusConfig.textColour,
                    }}
                  >
                    {verifyMessage}
                  </Typography>
                </Box>

                <Stack spacing={1}>
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    flexWrap="wrap"
                  >
                    {effectiveUrlType === URL_TYPE.IMAGE ? (
                      <ImageIcon fontSize="small" color="action" />
                    ) : effectiveUrlType === URL_TYPE.VIDEO ? (
                      <VideocamIcon fontSize="small" color="action" />
                    ) : null}

                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, wordBreak: "break-word" }}
                    >
                      {verifiedFile.name}
                    </Typography>

                    <Chip
                      size="small"
                      label={verifiedFile.mimeType}
                      variant="outlined"
                    />
                  </Box>

                  <MetadataRow
                    label="File size"
                    value={formatBytes(verifiedFile.size)}
                  />

                  {effectiveUrlType === URL_TYPE.VIDEO && (
                    <MetadataRow label="Duration" value={videoDuration} />
                  )}
                </Stack>

                {!isVerified && validationErrors.length > 0 && (
                  <Alert
                    severity={
                      verificationState === "warning" ? "warning" : "error"
                    }
                    variant="outlined"
                  >
                    {validationErrors[0]}
                  </Alert>
                )}
              </Stack>
            </Box>
          )}

          {!verifiedFile && verifyMessage && (
            <Alert severity="error">{verifyMessage}</Alert>
          )}
        </>
      ) : (
        <Typography>
          {trimmedAnswer !== "" ? (
            <Link href={trimmedAnswer} target="_blank" rel="noreferrer">
              {trimmedAnswer}
            </Link>
          ) : (
            "No URL was provided"
          )}
        </Typography>
      )}
    </Stack>
  );
};

export default UrlQuestion;

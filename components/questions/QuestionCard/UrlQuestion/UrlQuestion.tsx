import { ChangeEvent, FC, useState } from "react";
// Components
import {
  Link,
  Stack,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QuestionAndDesc from "../QuestionAndDesc/QuestionAndDesc";
// Types
import { LeanQuestion, Option, Question, URL_TYPE } from "@/types/deadlines";
import { validateUrl } from "@/helpers/string";

type Props = {
  question: LeanQuestion | Question;
  answer: Option;
  setAnswer: (newAnswer: string) => void;
  isReadonly: boolean;
  hasError?: boolean;
  onClearError?: () => void;
};

export const extractGoogleDriveFileId = (url: string): string | null => {
  const patterns = [
    /drive\.google\.com\/file\/d\/([^/]+)/,
    /[?&]id=([^&]+)/,
    /drive\.google\.com\/open\?id=([^&]+)/,
    /drive\.google\.com\/uc\?id=([^&]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
};

export const isGoogleDriveUrl = (url: string): boolean => {
  return /drive\.google\.com/.test(url);
};

const UrlQuestion: FC<Props> = ({
  question,
  answer,
  setAnswer,
  isReadonly,
  hasError = false,
  onClearError,
}) => {
  const [touched, setTouched] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState<string>("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    if (!touched) {
      setTouched(true);
    }

    setAnswer(newValue);
    setIsVerified(false);
    setVerifyError("");

    if (hasError && onClearError) {
      onClearError();
    }
  };

  const handleVerify = async () => {
    const fileId = extractGoogleDriveFileId(answer);

    if (!fileId) {
      setVerifyError("Could not extract a Google Drive file ID from this link");
      setIsVerified(false);
      return;
    }

    try {
      setIsVerifying(true);
      setVerifyError("");

      // replace with your real API call
      const result = { ok: false, message: "issue is testing" };

      if (!result.ok) {
        setVerifyError(result.message || "Could not verify this file");
        setIsVerified(false);
        return;
      }

      setIsVerified(true);
    } catch (error) {
      setVerifyError("Something went wrong while verifying this file");
      setIsVerified(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const isUrlFormatInvalid = touched && !validateUrl(answer);
  const effectiveUrlType = question.urlType ?? URL_TYPE.GENERIC;
  const requiresDriveValidation =
    effectiveUrlType === URL_TYPE.IMAGE || effectiveUrlType === URL_TYPE.VIDEO;
  const driveFileId = extractGoogleDriveFileId(answer);
  const isDriveUrlInvalid =
    touched &&
    answer !== "" &&
    requiresDriveValidation &&
    (!isGoogleDriveUrl(answer) || !driveFileId);
  const showRedBorder = isUrlFormatInvalid || isDriveUrlInvalid || hasError;
  const helperText =
    (hasError && "This field is required") ||
    (isUrlFormatInvalid && "Please enter a valid URL") ||
    (isDriveUrlInvalid &&
      "Please enter a valid Google Drive file link for this question");

  return (
    <Stack className="url-question" spacing="0.5rem" sx={{ width: "100%" }}>
      <QuestionAndDesc question={question} questionType="URL" />
      {!isReadonly ? (
        <>
          <TextField
            className="url-input"
            value={answer}
            onChange={handleChange}
            size="small"
            type="url"
            placeholder="Your URL here"
            error={showRedBorder}
            helperText={helperText}
            InputProps={{
              endAdornment:
                requiresDriveValidation && answer ? (
                  <InputAdornment position="end">
                    {isVerifying ? (
                      <CircularProgress size={18} />
                    ) : isVerified ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : (
                      <IconButton
                        onClick={handleVerify}
                        edge="end"
                        size="small"
                        disabled={isUrlFormatInvalid || isDriveUrlInvalid}
                      >
                        Verify
                      </IconButton>
                    )}
                  </InputAdornment>
                ) : null,
            }}
          />

          {verifyError && (
            <Typography variant="caption" color="error">
              {verifyError}
            </Typography>
          )}
        </>
      ) : (
        <Typography>
          {answer !== "" ? (
            <Link href={answer} target="_blank" rel="noreferrer">
              {answer}
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

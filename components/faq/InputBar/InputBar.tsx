import { Box, Button, IconButton, Tooltip } from "@mui/material";
import {
  AddOutlined,
  ArrowUpwardOutlined,
  KeyboardVoiceOutlined,
} from "@mui/icons-material";
import { Formik, Form } from "formik";
import TextInput from "@/components/formikFormControllers/TextInput";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import { useEffect, useRef } from "react";

const INPUT_WARNING_LIMIT = 3000;
const INPUT_EXCEEDED_LIMIT = 4000;

interface Props {
  isLoadingMessage: boolean;
  onSend: (content: string) => void;
  position?: "relative" | "fixed";
}

const InputBar = ({ isLoadingMessage, onSend, position = "fixed" }: Props) => {
  const isFixed = position === "fixed";
  const { setError } = useSnackbarAlert();
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto focus the input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  return (
    <Formik
      initialValues={{ input: "" }}
      onSubmit={(values, helpers) => {
        const content = values.input.trim();
        if (!content) return;
        onSend(content);
        helpers.resetForm();
      }}
      validate={(values) => {
        if (values.input.length > INPUT_EXCEEDED_LIMIT) {
          setError(
            `Your message too long, please shorten it. The max length is ${INPUT_EXCEEDED_LIMIT} characters.`
          );
        }
      }}
    >
      {(formik) => {
        const { values } = formik;
        const charCount = values.input.length;
        const isLimitExceeded = charCount > INPUT_EXCEEDED_LIMIT;
        const canSend =
          !isLoadingMessage && values.input.trim() && !isLimitExceeded;

        return (
          <Form
            style={{
              width: "100%",
            }}
          >
            <Box
              sx={{
                position: isFixed ? "fixed" : "relative",
                bottom: isFixed ? "18px" : undefined,
                left: isFixed ? "var(--faq-sidebar-width)" : undefined,
                transition: "left 0.2s ease",
                right: 0,
                display: "flex",
                flexDirection: "column",
                pointerEvents: "none",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  maxWidth: "760px",
                  borderRadius: "32px",
                  p: "0.5rem 1.0rem",
                  gap: "0.75rem",
                  display: "flex",
                  alignItems: "center",
                  background: "#f5f5f5",
                  pointerEvents: "auto",
                  border: "1px solid #e0e0e0",
                  contain: "layout paint",
                }}
              >
                <Tooltip title="Add attachments">
                  <IconButton disabled={isLoadingMessage}>
                    <AddOutlined />
                  </IconButton>
                </Tooltip>
                <TextInput
                  inputRef={inputRef}
                  name="input"
                  formik={formik}
                  placeholder="Ask a question"
                  disabled={isLoadingMessage}
                  onKeyDown={(
                    e: React.KeyboardEvent<
                      HTMLInputElement | HTMLTextAreaElement
                    >
                  ) => {
                    if (e.key !== "Enter" || e.shiftKey || !canSend) {
                      return;
                    }
                    e.preventDefault();
                    formik.submitForm();
                  }}
                  fullWidth
                  multiline
                  minRows={1}
                  maxRows={6}
                  bordered={false}
                />

                <Tooltip title="Voice">
                  <IconButton disabled={isLoadingMessage}>
                    <KeyboardVoiceOutlined />
                  </IconButton>
                </Tooltip>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={!canSend}
                  sx={{
                    minWidth: 40,
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    p: 0,
                    bgcolor: "#000",
                    color: "#fff",
                    "&:hover": { bgcolor: "#000" },
                    "&.Mui-disabled": {
                      bgcolor: "#e0e0e0",
                      color: "#9e9e9e",
                    },
                  }}
                >
                  <ArrowUpwardOutlined />
                </Button>
              </Box>

              {charCount > INPUT_WARNING_LIMIT && (
                <Box
                  sx={{
                    mt: "2px",
                    ml: "32px",
                    width: "100%",
                    maxWidth: "760px",
                    textAlign: "left",
                    fontSize: "0.85rem",
                    color: isLimitExceeded ? "#d32f2f" : "#515151",
                    pr: "12px",
                    pointerEvents: "auto",
                  }}
                >
                  {charCount} / {INPUT_EXCEEDED_LIMIT}
                  <span style={{ marginLeft: 6 }}>
                    ·{" "}
                    {isLimitExceeded
                      ? "Message is too long, please shorten it"
                      : "Consider shortening for clearer answers"}
                  </span>
                </Box>
              )}
            </Box>{" "}
          </Form>
        );
      }}
    </Formik>
  );
};

export default InputBar;

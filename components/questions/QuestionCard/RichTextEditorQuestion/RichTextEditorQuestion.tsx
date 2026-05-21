import { LeanQuestion, Question, Option } from "@/types/deadlines";
import { Box, FormHelperText, Stack } from "@mui/material";
import React, { FC } from "react";
import QuestionAndDesc from "../QuestionAndDesc";
import RichTextEditor from "@/components/formikFormControllers/RichTextEditor";
import { Formik } from "formik";

type Props = {
  question: LeanQuestion | Question;
  setAnswer: (newAnswer: string) => void;
  answer: Option;
  hasError?: boolean;
  onClearError?: () => void;
};

type RichTextEditorQuestionFormValues = {
  answer: Option;
};

const RichTextEditorQuestion: FC<Props> = ({
  question,
  answer,
  setAnswer,
  hasError = false,
  onClearError,
}) => {
  const initialValues: RichTextEditorQuestionFormValues = { answer };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleSubmit = () => {};
  const handleEditorChange = (content: string) => {
    setAnswer(content);
    if (hasError && onClearError) {
      onClearError();
    }
  };

  return (
    <Formik onSubmit={handleSubmit} initialValues={initialValues}>
      {(formik) => (
        <Stack
          className="rich-text-editor-question"
          spacing="0.5rem"
          sx={{ width: "100%" }}
        >
          <QuestionAndDesc question={question} questionType="RichTextEditor" />
          <Box
            sx={{
              border: hasError ? "1px solid" : "1px solid transparent",
              borderColor: hasError ? "error.main" : "transparent",
              borderRadius: "4px",
              padding: "2px",
              width: "100%",
              "& .MuiFormControl-root": {
                width: "100%",
              },
            }}
          >
            <RichTextEditor
              name="answer"
              formik={formik}
              handleChange={handleEditorChange}
            />
          </Box>
          {hasError && (
            <FormHelperText
              error
              sx={{ marginLeft: "14px", marginTop: "-4px" }}
            >
              This field is required
            </FormHelperText>
          )}
        </Stack>
      )}
    </Formik>
  );
};

export default RichTextEditorQuestion;

import { LeanQuestion, Question, Option } from "@/types/deadlines";
import { Stack } from "@mui/material";
import React, { FC } from "react";
import QuestionAndDesc from "../QuestionAndDesc";
import RichTextEditor from "@/components/formikFormControllers/RichTextEditor";
import { Formik } from "formik";

type Props = {
  question: LeanQuestion | Question;
  setAnswer: (newAnswer: string) => void;
  answer: Option;
};

type RichTextEditorQuestionFormValues = {
  answer: Option;
};

const RichTextEditorQuestion: FC<Props> = ({ question, answer, setAnswer }) => {
  const initialValues: RichTextEditorQuestionFormValues = { answer };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const handleSubmit = () => {};

  return (
    <Formik onSubmit={handleSubmit} initialValues={initialValues}>
      {(formik) => (
        <Stack
          className="rich-text-editor-question"
          spacing="0.5rem"
          sx={{ width: "100%" }}
        >
          <QuestionAndDesc question={question} questionType="RichTextEditor" />
          <RichTextEditor
            name="answer"
            formik={formik}
            handleChange={setAnswer}
          />
        </Stack>
      )}
    </Formik>
  );
};

export default RichTextEditorQuestion;

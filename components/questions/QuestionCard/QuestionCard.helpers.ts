import { LeanQuestion } from "@/types/deadlines";
import { ChangeEvent } from "react";

export const generateHandleTextFieldChange = (
  oldQuestion: LeanQuestion,
  setQuestion: (question: LeanQuestion) => void,
  attribute: keyof Pick<LeanQuestion, "question" | "desc">
) => {
  const handleTextFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newQuestion: LeanQuestion = { ...oldQuestion };
    newQuestion[attribute] = e.target.value;
    setQuestion(newQuestion);
  };

  return handleTextFieldChange;
};

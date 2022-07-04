import { LeanQuestion, QUESTION_TYPE } from "@/types/deadlines";

export const stripOptions = (questions: LeanQuestion[]) => {
  const strippedQuestions = questions.map((question) => {
    switch (question.type) {
      case QUESTION_TYPE.SHORT_ANSWER:
      case QUESTION_TYPE.PARAGRAPH:
      case QUESTION_TYPE.URL:
      case QUESTION_TYPE.DATE:
      case QUESTION_TYPE.TIME:
        return question;

      case QUESTION_TYPE.MULTIPLE_CHOICE:
      case QUESTION_TYPE.CHECKBOXES:
      case QUESTION_TYPE.DROPDOWN: {
        const strippedQuestion: LeanQuestion = { ...question };
        delete strippedQuestion.options;
        return strippedQuestion;
      }

      default:
        return null;
    }
  });
  return strippedQuestions;
};

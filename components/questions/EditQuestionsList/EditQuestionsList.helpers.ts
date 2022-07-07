import { isQuestion } from "@/helpers/types";
import { LeanQuestion, Question, QUESTION_TYPE } from "@/types/deadlines";
/**
 * Strips the questions of unused options and converts any existing Questions to new LeanQuestions
 * @param questions List of questions (can be a mix of LeanQuestions (new) and Questions (existing))
 */
export const processQuestions = (questions: (Question | LeanQuestion)[]) => {
  return stripOptions(stripQuestionsToLeanQuestions(questions));
};

const stripQuestionsToLeanQuestions = (
  questions: (Question | LeanQuestion)[]
): LeanQuestion[] => {
  return questions.map((question) => {
    if (isQuestion(question)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, deadlineId, questionNumber, ...strippedQuestion } = question;
      return strippedQuestion;
    } else {
      return question;
    }
  });
};

const stripOptions = (questions: LeanQuestion[]) => {
  const strippedQuestions = questions.map((question) => {
    switch (question.type) {
      case QUESTION_TYPE.SHORT_ANSWER:
      case QUESTION_TYPE.PARAGRAPH:
      case QUESTION_TYPE.URL:
      case QUESTION_TYPE.DATE:
      case QUESTION_TYPE.TIME: {
        const strippedQuestion: LeanQuestion = { ...question };
        delete strippedQuestion.options;
        return strippedQuestion;
      }

      case QUESTION_TYPE.MULTIPLE_CHOICE:
      case QUESTION_TYPE.CHECKBOXES:
      case QUESTION_TYPE.DROPDOWN:
        return question;

      default:
        return null;
    }
  });
  return strippedQuestions;
};

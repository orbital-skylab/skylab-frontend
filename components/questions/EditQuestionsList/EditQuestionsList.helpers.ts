import { isQuestion } from "@/helpers/types";
import { LeanQuestion, Question, QUESTION_TYPE } from "@/types/deadlines";
/**
 * Strips the questions of unused options and converts any existing Questions to new LeanQuestions
 * @param questions List of questions (can be a mix of LeanQuestions (new) and Questions (existing))
 */
export const processQuestions = (questions: (Question | LeanQuestion)[]) => {
  return stripOptions(
    stripQuestionsToLeanQuestions(stripEmptyQuestions(questions))
  );
};

/**
 * Strips questions that do not have any 'questions' (i.e. question.question === "")
 */
const stripEmptyQuestions = (
  questions: (Question | LeanQuestion)[]
): (Question | LeanQuestion)[] => {
  return questions.filter(({ question }) => !!question);
};

/**
 * Strips Questions to LeanQuestions (eg. remove id, deadlineId, questionNumber)
 * Some questions will contain these attributes as they are existing questions
 */
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

/**
 * Strips options from questions that do not need options (eg. Paragraph, ShortAnswer, etc.)
 */
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

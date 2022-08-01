import {
  LeanQuestion,
  LeanSection,
  Question,
  QUESTION_TYPE,
  Section,
} from "@/types/deadlines";
/**
 * Strips a section from a Section to a LeanSection.
 * Involves stripping all questions from Question[] to LeanQuestion[]
 * Used when fetching existing sections => Stripping them => Populating the form editor with the stripped data
 * @param {Section[]} sections Sections to be stripped
 * @returns Stripped sections
 */
export const stripSections = (sections: Section[]): LeanSection[] => {
  /**
   * Strips questions from Question[] to LeanQuestion[]
   * Removes id, sectionId, deadlineId, questionNumber
   */
  const stripQuestions = (questions: Question[]): LeanQuestion[] => {
    return questions.map((question) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, sectionId, questionNumber, ...strippedQuestion } = question;
      return strippedQuestion;
    });
  };

  return sections.map((section) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, deadlineId, sectionNumber, questions, ...strippedSection } =
      section;
    return { ...strippedSection, questions: stripQuestions(questions) };
  });
};

/**
 * Processes an array of sections to:
 * 1. Remove empty sections (Sections with no name)
 * 2. Remove empty questions (Questions with not question)
 * 3. Remove options from questions that do not need options
 * @param sections List of sections
 */
export const processSections = (sections: LeanSection[]): LeanSection[] => {
  /**
   * Strips sections that do not have a name
   */
  const stripEmptySections = (sections: LeanSection[]): LeanSection[] => {
    return sections.filter(({ name }) => !!name);
  };

  /**
   * Strips questions that do not have any 'questions' (i.e. question.question === "")
   */
  const stripEmptyQuestions = (questions: LeanQuestion[]): LeanQuestion[] => {
    return questions.filter(({ question }) => !!question);
  };

  /**
   * Strips options from questions that do not need options (eg. Paragraph, ShortAnswer, etc.)
   */
  const stripOptions = (questions: LeanQuestion[]): LeanQuestion[] => {
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
          return question;
      }
    });

    return strippedQuestions;
  };

  return stripEmptySections(sections).map((section) => {
    const { questions, ...sectionWithoutQuestions } = section;
    const processedQuestions = stripOptions(stripEmptyQuestions(questions));
    return { ...sectionWithoutQuestions, questions: processedQuestions };
  });
};

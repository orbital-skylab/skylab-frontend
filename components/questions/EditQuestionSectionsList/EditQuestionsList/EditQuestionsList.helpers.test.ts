/* eslint-disable no-undef */
import { describe, expect, it } from "@jest/globals";

import {
  PAPER_FORMAT,
  QUESTION_TYPE,
  URL_TYPE,
  type LeanSection,
} from "@/types/deadlines";
import { processSections } from "./EditQuestionsList.helpers";

describe("processSections", () => {
  it("preserves URL metadata for URL questions while stripping options", () => {
    const sections: LeanSection[] = [
      {
        name: "Lift-off",
        desc: "Submission",
        questions: [
          {
            question: "Poster URL (A1)",
            type: QUESTION_TYPE.URL,
            urlType: URL_TYPE.IMAGE,
            urlValidationRules: {
              allowedPaperFormats: [PAPER_FORMAT.A1],
              maxFileSizeBytes: 5 * 1024 * 1024,
            },
            options: ["unused"],
          },
        ],
      },
    ];

    const [processedSection] = processSections(sections);
    const [processedQuestion] = processedSection.questions;

    expect(processedQuestion).toMatchObject({
      question: "Poster URL (A1)",
      type: QUESTION_TYPE.URL,
      urlType: URL_TYPE.IMAGE,
      urlValidationRules: {
        allowedPaperFormats: [PAPER_FORMAT.A1],
        maxFileSizeBytes: 5 * 1024 * 1024,
      },
    });
    expect(processedQuestion.options).toBeUndefined();
  });

  it("removes URL metadata from non-URL questions", () => {
    const sections: LeanSection[] = [
      {
        name: "Lift-off Evaluation",
        desc: "",
        questions: [
          {
            question: "Is the Video URL valid?",
            type: QUESTION_TYPE.MULTIPLE_CHOICE,
            options: ["Yes", "No"],
            urlType: URL_TYPE.VIDEO,
            urlValidationRules: {
              maxDurationSeconds: 120,
            },
          },
        ],
      },
    ];

    const [processedSection] = processSections(sections);
    const [processedQuestion] = processedSection.questions;

    expect(processedQuestion).toMatchObject({
      question: "Is the Video URL valid?",
      type: QUESTION_TYPE.MULTIPLE_CHOICE,
      options: ["Yes", "No"],
    });
    expect(processedQuestion.urlType).toBeUndefined();
    expect(processedQuestion.urlValidationRules).toBeUndefined();
  });
});

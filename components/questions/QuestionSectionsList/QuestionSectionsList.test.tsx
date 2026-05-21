/* eslint-disable no-undef */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import {
  PAPER_FORMAT,
  QUESTION_TYPE,
  URL_TYPE,
  type LeanSection,
  type Section,
} from "@/types/deadlines";

const mockSetError = jest.fn();
const mockVerifyDriveFile = jest.fn();

jest.mock("./QuestionsList", () => ({
  __esModule: true,
  default: ({
    questions,
    errors,
  }: {
    questions: Array<{ question: string; id?: number }>;
    errors: Record<string, { message?: string }>;
  }) => (
    <div>
      {questions.map((question, index) => (
        <div key={question.id ?? index}>{question.question}</div>
      ))}
      {Object.entries(errors).map(([key, value]) => (
        <div key={key}>{value.message}</div>
      ))}
    </div>
  ),
}));

jest.mock("@/contexts/useSnackbarAlert", () => ({
  __esModule: true,
  default: () => ({
    setError: mockSetError,
  }),
}));

jest.mock("@/hooks/useApiCall", () => ({
  __esModule: true,
  default: () => ({
    call: mockVerifyDriveFile,
  }),
}));

const QuestionSectionsList = require("./QuestionSectionsList").default;

const buildSection = (question: Section["questions"][number]): Section => ({
  id: "section-1",
  deadlineId: 1,
  sectionNumber: 1,
  name: "Lift-off Submission",
  desc: "Submit your links",
  questions: [question],
});

const buildLeanSection = (
  question: LeanSection["questions"][number]
): LeanSection => ({
  name: "Lift-off Submission",
  desc: "Submit your links",
  questions: [question],
});

describe("QuestionSectionsList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("blocks submission for invalid generic URL answers at submit time", async () => {
    const submitAnswers = jest.fn();

    render(
      <QuestionSectionsList
        questionSections={[
          buildSection({
            id: 101,
            sectionId: 1,
            questionNumber: 1,
            question: "Poster URL",
            type: QUESTION_TYPE.URL,
            urlType: URL_TYPE.GENERIC,
          }),
        ]}
        answers={new Map([[101, "not-a-url"]])}
        submitAnswers={submitAnswers}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockSetError).toHaveBeenCalledWith(
      'Please fix the URL format for: "Poster URL"'
    );

    expect(submitAnswers).not.toHaveBeenCalled();
    expect(mockVerifyDriveFile).not.toHaveBeenCalled();
    expect(screen.getByText("Please enter a valid URL")).toBeTruthy();
  });

  it("revalidates image URLs using URL metadata and submits when verification passes", async () => {
    const submitAnswers = jest.fn();

    mockVerifyDriveFile.mockImplementation(
      async () =>
        ({
          verified: true,
          message: "Verified",
          file: null,
          validation: {
            isValid: true,
            errors: [],
          },
        } as never)
    );

    render(
      <QuestionSectionsList
        questionSections={[
          buildLeanSection({
            question: "Poster URL (A1)",
            type: QUESTION_TYPE.URL,
            urlType: URL_TYPE.IMAGE,
            urlValidationRules: {
              allowedPaperFormats: [PAPER_FORMAT.A1],
            },
          }),
        ]}
        answers={new Map([[0, "https://drive.google.com/file/d/abc123/view"]])}
        accessAnswersWithQuestionIndex
        submitAnswers={submitAnswers}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockVerifyDriveFile).toHaveBeenCalledWith(
        expect.objectContaining({
          url: "https://drive.google.com/file/d/abc123/view",
          urlType: URL_TYPE.IMAGE,
          urlValidationRules: {
            allowedPaperFormats: [PAPER_FORMAT.A1],
          },
        })
      );
      expect(submitAnswers).toHaveBeenCalledWith({
        isDraft: false,
        shouldDisplaySuccess: true,
      });
    });
  });

  it("blocks submission when Drive verification fails and surfaces the validation message", async () => {
    const submitAnswers = jest.fn();

    mockVerifyDriveFile.mockImplementation(
      async () =>
        ({
          verified: false,
          message: "File is reachable but invalid",
          file: null,
          validation: {
            isValid: false,
            errors: ["Poster does not match the required A1 format"],
          },
        } as never)
    );

    render(
      <QuestionSectionsList
        questionSections={[
          buildLeanSection({
            question: "Poster URL (A1)",
            type: QUESTION_TYPE.URL,
            urlType: URL_TYPE.IMAGE,
            urlValidationRules: {
              allowedPaperFormats: [PAPER_FORMAT.A1],
            },
          }),
        ]}
        answers={new Map([[0, "https://drive.google.com/file/d/abc123/view"]])}
        accessAnswersWithQuestionIndex
        submitAnswers={submitAnswers}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockSetError).toHaveBeenCalledWith(
        'Please fix: "Poster URL (A1)" (Poster does not match the required A1 format)'
      );
    });

    expect(submitAnswers).not.toHaveBeenCalled();
    expect(
      screen.getByText("Poster does not match the required A1 format")
    ).toBeTruthy();
  });

  it("ignores anonymous required questions unless anonymous questions are included", async () => {
    const submitAnswers = jest.fn();

    const anonymousQuestion = buildSection({
      id: 202,
      sectionId: 1,
      questionNumber: 1,
      question: "Internal note",
      type: QUESTION_TYPE.PARAGRAPH,
      isAnonymous: true,
      isRequired: true,
    });

    const { rerender } = render(
      <QuestionSectionsList
        questionSections={[anonymousQuestion]}
        answers={new Map()}
        submitAnswers={submitAnswers}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(submitAnswers).toHaveBeenCalledWith({
      isDraft: false,
      shouldDisplaySuccess: true,
    });

    rerender(
      <QuestionSectionsList
        questionSections={[anonymousQuestion]}
        answers={new Map()}
        submitAnswers={submitAnswers}
        includeAnonymousQuestions
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockSetError).toHaveBeenCalledWith(
      'Please fill in: "Internal note"'
    );
  });
});

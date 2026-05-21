/* eslint-disable no-undef */
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";

import {
  PAPER_FORMAT,
  QUESTION_TYPE,
  URL_TYPE,
  type LeanQuestion,
} from "@/types/deadlines";
import type { QuestionVerificationState } from "../../QuestionSectionsList/QuestionSectionsList";
import UrlQuestion from "./UrlQuestion";

const mockVerifyDriveFile = jest.fn();
const mockOnClearError = jest.fn();

jest.mock("@/hooks/useApiCall", () => ({
  __esModule: true,
  default: () => ({
    call: (...args: unknown[]) => mockVerifyDriveFile(...args),
  }),
}));

const StatefulUrlQuestion = ({
  question,
  initialAnswer = "",
  initialVerificationResult,
}: {
  question: LeanQuestion;
  initialAnswer?: string;
  initialVerificationResult?: QuestionVerificationState;
}) => {
  const [answer, setAnswer] = useState(initialAnswer);
  const [verificationResult, setVerificationResult] =
    useState<QuestionVerificationState>({
      verified: false,
      message: "",
      file: null,
      validationErrors: [],
      ...initialVerificationResult,
    });

  return (
    <UrlQuestion
      question={question}
      answer={answer}
      setAnswer={setAnswer}
      isReadonly={false}
      onClearError={mockOnClearError}
      verificationResult={verificationResult}
      setVerificationResult={setVerificationResult}
    />
  );
};

describe("UrlQuestion", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows a URL format error for invalid generic links after blur", async () => {
    render(
      <StatefulUrlQuestion
        question={{
          question: "Video URL",
          type: QUESTION_TYPE.URL,
          urlType: URL_TYPE.GENERIC,
        }}
      />
    );

    const input = screen.getByPlaceholderText("Your URL here");

    fireEvent.change(input, { target: { value: "not-a-url" } });
    fireEvent.blur(input);

    expect(screen.getByText("Please enter a valid URL")).toBeTruthy();

    expect(mockOnClearError).toHaveBeenCalled();
  });

  it("shows the Drive-link helper and disables verification for invalid image links", async () => {
    render(
      <StatefulUrlQuestion
        question={{
          question: "Poster URL (A1)",
          type: QUESTION_TYPE.URL,
          urlType: URL_TYPE.IMAGE,
          urlValidationRules: {
            allowedPaperFormats: [PAPER_FORMAT.A1],
          },
        }}
        initialAnswer="https://example.com/poster.png"
      />
    );

    const input = screen.getByPlaceholderText("Your URL here");
    fireEvent.blur(input);

    expect(
      screen.getByText(
        "Please enter a valid Google Drive file link for this question"
      )
    ).toBeTruthy();

    expect(
      screen.getByRole("button", { name: "Verify" }).hasAttribute("disabled")
    ).toBe(true);
  });

  it("renders the verification panel for a successful verified image", () => {
    render(
      <StatefulUrlQuestion
        question={{
          question: "Poster URL (A1)",
          type: QUESTION_TYPE.URL,
          urlType: URL_TYPE.IMAGE,
          urlValidationRules: {
            allowedPaperFormats: [PAPER_FORMAT.A1],
            maxFileSizeBytes: 10485760,
          },
        }}
        initialAnswer="https://drive.google.com/file/d/abc123/view"
        initialVerificationResult={{
          verified: true,
          message: "File verified successfully",
          file: {
            name: "lift-off-poster.png",
            mimeType: "image/png",
            size: 5242880,
          },
          validationErrors: [],
        }}
      />
    );

    expect(screen.getByText("File verified successfully")).toBeTruthy();
    expect(screen.getByText("lift-off-poster.png")).toBeTruthy();
    expect(screen.getByText("image/png")).toBeTruthy();
  });

  it("renders the returned validation error for a failed verified video", () => {
    render(
      <StatefulUrlQuestion
        question={{
          question: "Video URL",
          type: QUESTION_TYPE.URL,
          urlType: URL_TYPE.VIDEO,
          urlValidationRules: {
            maxDurationSeconds: 120,
          },
        }}
        initialAnswer="https://drive.google.com/file/d/video123/view"
        initialVerificationResult={{
          verified: false,
          message: "File is reachable but does not meet validation rules",
          file: {
            name: "lift-off-video.mp4",
            mimeType: "video/mp4",
            size: 20971520,
            videoMetadata: {
              durationMillis: 180000,
            },
          },
          validationErrors: ["Video exceeds maximum duration"],
        }}
      />
    );

    expect(
      screen.getByText("File is reachable but does not meet validation rules")
    ).toBeTruthy();
    expect(screen.getByText("Video exceeds maximum duration")).toBeTruthy();
    expect(screen.getByText("lift-off-video.mp4")).toBeTruthy();
  });
});

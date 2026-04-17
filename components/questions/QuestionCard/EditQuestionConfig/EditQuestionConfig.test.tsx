/* eslint-disable no-undef */
import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";

import {
  PAPER_FORMAT,
  QUESTION_TYPE,
  URL_TYPE,
  type LeanQuestion,
} from "@/types/deadlines";
import EditQuestionConfig from "./EditQuestionConfig";

const selectMuiOption = (buttonName: string, optionText: string) => {
  fireEvent.mouseDown(screen.getByRole("button", { name: buttonName }));
  fireEvent.click(screen.getByRole("option", { name: optionText }));
};

const StatefulEditQuestionConfig = ({
  initialQuestion,
}: {
  initialQuestion: LeanQuestion;
}) => {
  const [question, setQuestion] = useState<LeanQuestion>(initialQuestion);
  const handleSetQuestion = (nextQuestion?: LeanQuestion) => {
    if (nextQuestion) {
      setQuestion(nextQuestion);
    }
  };

  return (
    <>
      <EditQuestionConfig question={question} setQuestion={handleSetQuestion} />
      <pre data-testid="question-json">{JSON.stringify(question)}</pre>
    </>
  );
};

describe("EditQuestionConfig", () => {
  it("defaults URL questions to Generic when switching type to URL", () => {
    render(
      <StatefulEditQuestionConfig
        initialQuestion={{
          question: "Lift-off submission",
          type: QUESTION_TYPE.SHORT_ANSWER,
        }}
      />
    );

    selectMuiOption("Question type Short Answer", "Url");

    expect(screen.getByTestId("question-json").textContent).toContain(
      `"type":"${QUESTION_TYPE.URL}"`
    );
    expect(screen.getByTestId("question-json").textContent).toContain(
      `"urlType":"${URL_TYPE.GENERIC}"`
    );
  });

  it("maps image validation modes to A1, A4, and no validation", () => {
    render(
      <StatefulEditQuestionConfig
        initialQuestion={{
          question: "Poster URL",
          type: QUESTION_TYPE.URL,
          urlType: URL_TYPE.IMAGE,
          urlValidationRules: {},
        }}
      />
    );

    selectMuiOption("Validation mode No validation", "A1");
    expect(screen.getByTestId("question-json").textContent).toContain(
      `"allowedPaperFormats":["${PAPER_FORMAT.A1}"]`
    );

    selectMuiOption("Validation mode A1", "A4");
    expect(screen.getByTestId("question-json").textContent).toContain(
      `"allowedPaperFormats":["${PAPER_FORMAT.A4}"]`
    );

    selectMuiOption("Validation mode A4", "No validation");
    expect(screen.getByTestId("question-json").textContent).toContain(
      `"allowedPaperFormats":[]`
    );
  });

  it("keeps only video validation rules when switching URL type to Video", () => {
    render(
      <StatefulEditQuestionConfig
        initialQuestion={{
          question: "Video URL",
          type: QUESTION_TYPE.URL,
          urlType: URL_TYPE.IMAGE,
          urlValidationRules: {
            allowedPaperFormats: [PAPER_FORMAT.A1],
            maxFileSizeBytes: 10485760,
          },
        }}
      />
    );

    selectMuiOption("URL type Image", "Video");

    const json = screen.getByTestId("question-json").textContent ?? "";
    expect(json).toContain(`"urlType":"${URL_TYPE.VIDEO}"`);
    expect(json).toContain(`"maxFileSizeBytes":10485760`);
    expect(json).not.toContain("allowedPaperFormats");

    fireEvent.change(screen.getByLabelText("Min duration (seconds)"), {
      target: { value: "30" },
    });
    fireEvent.change(screen.getByLabelText("Max duration (seconds)"), {
      target: { value: "120" },
    });

    const updatedJson = screen.getByTestId("question-json").textContent ?? "";
    expect(updatedJson).toContain(`"minDurationSeconds":30`);
    expect(updatedJson).toContain(`"maxDurationSeconds":120`);
  });
});

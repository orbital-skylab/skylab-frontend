/* eslint-disable no-undef */
import { describe, expect, it, jest, beforeEach } from "@jest/globals";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";

import { DEADLINE_TYPE, EVALUATOR_TYPE } from "@/types/deadlines";
import { SUBMISSION_STATUS } from "@/types/submissions";

const mockSetError = jest.fn();
const mockFetchEvaluations = jest.fn();
const mockMapEvaluationData = jest.fn();

jest.mock("@/contexts/useCohort", () => ({
  __esModule: true,
  default: () => ({
    currentCohortYear: 2026,
  }),
}));

jest.mock("@/contexts/useSnackbarAlert", () => ({
  __esModule: true,
  default: () => ({
    setError: mockSetError,
  }),
}));

jest.mock("@/components/modals/SendEvaluationReminderModal", () => ({
  __esModule: true,
  default: ({
    open,
    evaluatorTypeFilter,
    selectedCohortYear,
  }: {
    open: boolean;
    evaluatorTypeFilter: string;
    selectedCohortYear: number | "";
  }) =>
    open ? (
      <div data-testid="send-evaluation-reminder-modal">
        {`${evaluatorTypeFilter}-${selectedCohortYear}`}
      </div>
    ) : null,
}));

jest.mock("react-csv", () => ({
  CSVDownload: ({ data }: { data: Record<string, string | number>[] }) => (
    <div data-testid="csv-download">{data.length}</div>
  ),
}));

jest.mock("./EvaluationsActionRow.helpers", () => ({
  mapEvaluationData: (
    evaluations: unknown[],
    csvEvaluations: unknown[],
    isSelectedEvaluationExport: boolean
  ) =>
    mockMapEvaluationData(
      evaluations,
      csvEvaluations,
      isSelectedEvaluationExport
    ),
}));

jest.mock("@/helpers/api", () => ({
  ApiServiceBuilder: jest.fn().mockImplementation(() => ({
    build: () => mockFetchEvaluations,
  })),
}));

const EvaluationsActionRow = require("./EvaluationsActionRow").default;

const evaluationOne = {
  id: 21,
  cohortYear: 2026,
  name: "Peer Critique Round 1",
  dueBy: "2026-03-10T00:00:00.000Z",
  type: DEADLINE_TYPE.EVALUATION,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  evaluatorType: EVALUATOR_TYPE.TEAM,
};

const evaluationTwo = {
  id: 22,
  cohortYear: 2026,
  name: "Adviser Feedback Review",
  dueBy: "2026-03-15T00:00:00.000Z",
  type: DEADLINE_TYPE.EVALUATION,
  createdAt: "2026-02-01T00:00:00.000Z",
  updatedAt: "2026-02-01T00:00:00.000Z",
  evaluatorType: EVALUATOR_TYPE.ADVISER,
};

const feedbackDeadline = {
  ...evaluationOne,
  id: 23,
  name: "Team Feedback",
  type: DEADLINE_TYPE.FEEDBACK,
};

const defaultProps = {
  selectedEvaluationsDeadline: null,
  handleSelectedEvaluationsDeadlineChange: jest.fn(),
  selectedSubmissionStatus: SUBMISSION_STATUS.ALL,
  handleSubmissionStatusChange: jest.fn(),
  searchTextInput: "",
  handleSearchInputChange: jest.fn(),
  evaluationsDeadlines: [evaluationOne, evaluationTwo],
  viewHasDropped: false,
  handleToggleViewDropped: jest.fn(),
  selectedCohortYear: 2025 as number | "",
  selectedEvaluatorType: "All",
  handleEvaluatorTypeChange: jest.fn(),
};

describe("EvaluationsActionRow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows the submission status filter only when a specific evaluation is selected", () => {
    const { rerender } = render(<EvaluationsActionRow {...defaultProps} />);

    expect(screen.queryByLabelText("Submission Status")).toBeNull();
    expect(screen.getByLabelText("Evaluator Type")).toBeTruthy();
    expect(
      screen.getByLabelText("Search Evaluator / Evaluatee Name")
    ).toBeTruthy();

    rerender(
      <EvaluationsActionRow
        {...defaultProps}
        selectedEvaluationsDeadline={evaluationOne}
      />
    );

    expect(screen.getByLabelText("Submission Status")).toBeTruthy();
  });

  it("opens the reminder modal with the current cohort and evaluator filter", () => {
    render(
      <EvaluationsActionRow
        {...defaultProps}
        selectedCohortYear={2024}
        selectedEvaluatorType="Adviser"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: "Send Reminders" }));

    expect(
      screen.getByTestId("send-evaluation-reminder-modal").textContent
    ).toBe("Adviser-2024");
  });

  it("supports feedback-specific deadline labels", () => {
    render(
      <EvaluationsActionRow
        {...defaultProps}
        evaluationsDeadlines={[feedbackDeadline]}
      />
    );

    expect(screen.getByLabelText("Feedback").textContent).toBe("All Feedback");
  });

  it("exports CSV with the selected filters and renders the mapped download payload", async () => {
    const { ApiServiceBuilder } = jest.requireMock("@/helpers/api") as {
      ApiServiceBuilder: {
        mock: {
          calls: unknown[][];
        };
      };
    };

    mockFetchEvaluations.mockImplementation(async () => ({
      json: async () => ({
        submissions: [{ relationId: 1 }],
      }),
    }));
    mockMapEvaluationData.mockReturnValue([{ foo: "bar" }]);

    render(
      <EvaluationsActionRow
        {...defaultProps}
        selectedEvaluationsDeadline={evaluationOne}
        selectedSubmissionStatus={SUBMISSION_STATUS.SUBMITTED}
        selectedCohortYear=""
        selectedEvaluatorType="Team"
        viewHasDropped={true}
      />
    );

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Export CSV" }));
    });

    await waitFor(() => {
      expect(ApiServiceBuilder.mock.calls[0]?.[0]).toEqual({
        method: "GET",
        endpoint: "/dashboard/administrator/evaluations",
        queryParams: {
          cohortYear: 2026,
          deadlineId: evaluationOne.id,
          dropped: true,
          evaluatorTypeFilter: "Team",
          submissionStatus: SUBMISSION_STATUS.SUBMITTED,
        },
        requiresAuthorization: true,
      });
    });

    await waitFor(() => {
      expect(mockMapEvaluationData).toHaveBeenCalledWith(
        [{ relationId: 1 }],
        [evaluationOne],
        true
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId("csv-download").textContent).toBe("1");
    });
  });
});

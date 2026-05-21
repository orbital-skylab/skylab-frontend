/* eslint-disable no-undef */
import { describe, expect, it } from "@jest/globals";

import { DEADLINE_TYPE, Deadline } from "@/types/deadlines";
import { LEVELS_OF_ACHIEVEMENT } from "@/types/projects";
import { mapData } from "./ActionRow.helpers";

const liftOffDeadline: Deadline = {
  id: 31,
  cohortYear: 2026,
  name: "Lift-Off Submission",
  dueBy: "2026-05-18T16:00:00.000Z",
  type: DEADLINE_TYPE.MILESTONE,
  createdAt: "2026-05-01T00:00:00.000Z",
  updatedAt: "2026-05-01T00:00:00.000Z",
};

const project = {
  id: 6603,
  name: "Amazing Project",
  teamName: "Team Amaze",
  proposalPdf: "",
  videoUrl: "",
  posterUrl: "",
  students: [
    {
      id: 1,
      studentId: 1,
      name: "Leong Yi Quan",
      email: "student-one@example.com",
      cohortYear: 2026,
      projectId: 6603,
      nusnetId: "e0000001",
      matricNo: "A0000001A",
    },
    {
      id: 2,
      studentId: 2,
      name: "Chen Ye Kai Trevor",
      email: "student-two@example.com",
      cohortYear: 2026,
      projectId: 6603,
      nusnetId: "e0000002",
      matricNo: "A0000002A",
    },
  ],
  achievement: LEVELS_OF_ACHIEVEMENT.GEMINI,
  cohortYear: 2026,
  hasDropped: false,
};

describe("mapData", () => {
  it("uses nested submissions for a single-milestone all export", () => {
    const [result] = mapData(
      [
        {
          deadline: liftOffDeadline,
          fromProject: project,
          submission: [
            {
              id: 9001,
              deadline: liftOffDeadline,
              deadlineId: liftOffDeadline.id,
              updatedAt: "2026-05-18T14:38:00.000Z",
              isDraft: false,
              answers: [],
              sections: [],
            },
          ],
        },
      ],
      [liftOffDeadline],
      false
    );

    expect(result).toMatchObject({
      "Project Id": 6603,
      "Project Name": "Amazing Project",
      "Team Name": "Team Amaze",
      "Lift-Off Submission Submission Updated At": "2026-05-18T14:38:00.000Z",
      "Lift-Off Submission Status": "SUBMITTED",
    });
  });

  it("uses top-level submission fields for a selected milestone export", () => {
    const [result] = mapData(
      [
        {
          deadline: liftOffDeadline,
          id: 9001,
          updatedAt: "2026-05-18T17:00:00.000Z",
          fromProject: project,
        },
      ],
      [liftOffDeadline],
      true
    );

    expect(result).toMatchObject({
      "Project Id": 6603,
      "Project Name": "Amazing Project",
      "Team Name": "Team Amaze",
      "Lift-Off Submission Submission Updated At": "2026-05-18T17:00:00.000Z",
      "Lift-Off Submission Status": "SUBMITTED_LATE",
    });
  });
});

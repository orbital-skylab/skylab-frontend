/* eslint-disable no-undef */
import { describe, expect } from "@jest/globals";
import { getTabFromQuery } from "./dashboard";

enum TEST_TAB {
  DEADLINES = "Upcoming Deadlines",
  SUBMISSIONS = "Your Teams' Submissions",
  TEAMS = "View Your Teams",
}

const TAB_QUERY_VALUES: Record<TEST_TAB, string> = {
  [TEST_TAB.DEADLINES]: "deadlines",
  [TEST_TAB.SUBMISSIONS]: "submissions",
  [TEST_TAB.TEAMS]: "teams",
};

describe("#getTabFromQuery", () => {
  it("can return the tab matching a query value", () => {
    expect(
      getTabFromQuery("submissions", TAB_QUERY_VALUES, TEST_TAB.DEADLINES)
    ).toBe(TEST_TAB.SUBMISSIONS);
  });

  it("can use the first query value if the query is an array", () => {
    expect(
      getTabFromQuery(
        ["teams", "submissions"],
        TAB_QUERY_VALUES,
        TEST_TAB.DEADLINES
      )
    ).toBe(TEST_TAB.TEAMS);
  });

  it("falls back when the query value is undefined", () => {
    expect(
      getTabFromQuery(undefined, TAB_QUERY_VALUES, TEST_TAB.DEADLINES)
    ).toBe(TEST_TAB.DEADLINES);
  });

  it("falls back when the query value is unknown", () => {
    expect(
      getTabFromQuery("unknown", TAB_QUERY_VALUES, TEST_TAB.DEADLINES)
    ).toBe(TEST_TAB.DEADLINES);
  });
});

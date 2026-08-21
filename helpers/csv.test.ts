/* eslint-disable no-undef */
import { describe, expect, it } from "@jest/globals";

import { toSingleLineCsvText } from "./csv";

describe("toSingleLineCsvText", () => {
  it("replaces common line endings with spaces", () => {
    expect(toSingleLineCsvText("First\r\nSecond")).toBe("First Second");
    expect(toSingleLineCsvText("First\nSecond")).toBe("First Second");
    expect(toSingleLineCsvText("First\rSecond")).toBe("First Second");
  });

  it("returns an empty string for missing text", () => {
    expect(toSingleLineCsvText(undefined)).toBe("");
    expect(toSingleLineCsvText(null)).toBe("");
    expect(toSingleLineCsvText("")).toBe("");
  });
});

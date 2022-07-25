/* eslint-disable no-undef */
import { describe, expect } from "@jest/globals";
import { isoDateToDateTimeLocalInput } from "./dates";

describe("#isoDateToDateTimeLocalInput", () => {
  it("convertsADate", () => {
    const isoDate = "2022-07-08T08:51:57.079Z";
    const convertedDate = isoDateToDateTimeLocalInput(isoDate);
    const expectedDate = "2022-07-08T16:51";
    expect(convertedDate).toEqual(expectedDate);
  });
});

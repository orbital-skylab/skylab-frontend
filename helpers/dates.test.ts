/* eslint-disable no-undef */
import {
  dateTimeLocalInputToIsoDate,
  getTodayAtTimeIso,
  isoDateToDateTimeLocalInput,
  isoDateToLocaleDateWithTime,
  isValidDate,
} from "./dates";

describe("#isValidDate", () => {
  it("can detect valid dates", () => {
    expect(isValidDate(new Date("2022-07-08T08:51:57.079Z"))).toBeTruthy();
    expect(isValidDate(new Date("2022-07-02"))).toBeTruthy();
    expect(isValidDate(new Date())).toBeTruthy();
  });

  it("can detect invalid dates", () => {
    expect(isValidDate(new Date("202-07-08T08:51:57.079Z"))).toBeFalsy();
    expect(isValidDate(new Date("2022-2000-2000"))).toBeFalsy();
    expect(isValidDate(new Date("what?"))).toBeFalsy();
  });
});

describe("#isoDateToLocaleDateWithTime", () => {
  it("can convert an ISO date", () => {
    expect(isoDateToLocaleDateWithTime("2022-07-08T08:51:57.079Z")).toBe(
      "08/07/2022, 16:51"
    );
  });

  it("will not convert invalid dates", () => {
    expect(isoDateToLocaleDateWithTime("invalid")).toBe(
      "An invalid date was provided"
    );
  });
});

describe("#isoDateToDateTimeLocalInput", () => {
  it("converts a date successfully", () => {
    const isoDate = "2022-07-08T08:51:57.079Z";
    const expectedDate = "2022-07-08T16:51";
    expect(isoDateToDateTimeLocalInput(isoDate)).toEqual(expectedDate);
  });

  it("does not convert an invalid date", () => {
    const invalidIsoDate = "2022-07-2000T08:51:57.079Z";
    expect(isoDateToDateTimeLocalInput(invalidIsoDate)).toEqual("");
  });
});

describe("#dateTimeLocalInputToIsoDate", () => {
  it("converts a date successfully", () => {
    const dateTimeLocalInput = "2022-07-08T16:51";
    const expectedDate = "2022-07-08T08:51:00.000Z";
    expect(dateTimeLocalInputToIsoDate(dateTimeLocalInput)).toEqual(
      expectedDate
    );
  });

  it("does not convert an invalid date", () => {
    const invalidDateTimeLocalInput = "2022-07-2022T16:51";
    expect(dateTimeLocalInputToIsoDate(invalidDateTimeLocalInput)).toEqual("");
  });
});

describe("#getTodayAtTimeIso", () => {
  beforeEach(() => {
    jest.useFakeTimers({ now: 1658399772714 });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("can get todays time", () => {
    const expectedTime = "2022-07-21T06:00:12.714Z";
    expect(getTodayAtTimeIso(14)).toBe(expectedTime);
  });

  it("can get todays time at midnight", () => {
    const expectedTime = "2022-07-21T16:00:12.714Z";
    expect(getTodayAtTimeIso(24)).toBe(expectedTime);
  });

  it("can get todays time at 23:59", () => {
    const expectedTime = "2022-07-21T15:59:12.714Z";
    expect(getTodayAtTimeIso(23, 59)).toBe(expectedTime);
  });
});

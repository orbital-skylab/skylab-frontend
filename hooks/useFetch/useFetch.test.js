/* eslint-disable no-undef */
import { isFetching, isError } from "./useFetch.helpers";
import { describe, expect } from "@jest/globals";
import { FETCH_STATUS } from "./useFetch.types";

describe("#isFetching", () => {
  it("returns true with one status", () => {
    expect(isFetching(FETCH_STATUS.FETCHING)).toBeTruthy();
  });

  it("returns true with multiple statuses where one is fetching", () => {
    expect(
      isFetching(FETCH_STATUS.FETCHING, FETCH_STATUS.FETCHED)
    ).toBeTruthy();
  });

  it("returns true with multiple statuses where all is fetching", () => {
    expect(
      isFetching(FETCH_STATUS.FETCHING, FETCH_STATUS.FETCHING)
    ).toBeTruthy();
  });

  it("returns false with one status", () => {
    expect(isFetching(FETCH_STATUS.FETCHED)).toBeFalsy();
  });
});

describe("#isError", () => {
  it("returns true with one status", () => {
    expect(isError(FETCH_STATUS.ERROR)).toBeTruthy();
  });

  it("returns true with multiple statuses where one is error", () => {
    expect(isError(FETCH_STATUS.ERROR, FETCH_STATUS.FETCHED)).toBeTruthy();
  });

  it("returns true with multiple statuses where all is error", () => {
    expect(isError(FETCH_STATUS.ERROR, FETCH_STATUS.ERROR)).toBeTruthy();
  });

  it("returns false with one status", () => {
    expect(isError(FETCH_STATUS.FETCHED)).toBeFalsy();
  });

  it("returns false with multiple statuses where none is error", () => {
    expect(
      isError(FETCH_STATUS.FETCHED, FETCH_STATUS.FETCHING, FETCH_STATUS.IDLE)
    ).toBeFalsy();
  });
});

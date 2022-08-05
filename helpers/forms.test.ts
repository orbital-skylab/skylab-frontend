/* eslint-disable no-undef */
import { describe, expect } from "@jest/globals";
import { areAllEmptyValues, hasEmptyValues, stripEmptyStrings } from "./forms";

describe("#stripEmptyStrings", () => {
  it("can strip empty strings", () => {
    const expected = {
      yes: "1",
    };
    expect(stripEmptyStrings({ yes: "1", no: "" })).toEqual(expected);
  });

  it("does not strip if there are no empty strings", () => {
    const expected = {
      yes: "1",
      yes2: "2",
    };
    expect(stripEmptyStrings({ yes: "1", yes2: "2" })).toEqual(expected);
  });

  it("does not strip null and undefined values", () => {
    const expected = {
      yes: null,
      yes2: undefined,
    };
    expect(stripEmptyStrings({ yes: null, yes2: undefined })).toEqual(expected);
  });
});

describe("#areAllEmptyValues", () => {
  it("can detect all empty values", () => {
    expect(
      areAllEmptyValues({ empty: "", empty2: "", empty3: "" })
    ).toBeTruthy();
  });

  it("detects an empty object", () => {
    expect(areAllEmptyValues({})).toBeTruthy();
  });

  it("can detect no empty values", () => {
    expect(areAllEmptyValues({ yes: "valid", ye: "exists" })).toBeFalsy();
  });

  it("can detect only some empty values", () => {
    expect(
      areAllEmptyValues({ yes: "valid", ye: "exists", empty1: "" })
    ).toBeFalsy();
  });
});

describe("#hasEmptyValues", () => {
  it("can detect some empty values", () => {
    expect(hasEmptyValues({ empty: "", empty2: "", empty3: "" })).toBeTruthy();
  });

  it("detects an empty object", () => {
    expect(hasEmptyValues({})).toBeFalsy();
  });

  it("can detect no empty values", () => {
    expect(hasEmptyValues({ yes: "valid", ye: "exists" })).toBeFalsy();
  });

  it("can detect only some empty values", () => {
    expect(
      hasEmptyValues({ yes: "valid", ye: "exists", empty1: "" })
    ).toBeTruthy();
  });
});

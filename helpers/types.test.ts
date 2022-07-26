/* eslint-disable no-undef */
import { QUESTION_TYPE } from "@/types/deadlines";
import {
  isAddUserFormValuesType,
  isArray,
  isErrorType,
  isNotUndefined,
  isQuestion,
  isSection,
} from "./types";

describe("#isNotUndefined", () => {
  it("can detect a value that is not undefined", () => {
    expect(isNotUndefined(1)).toBeTruthy();
    expect(isNotUndefined(0)).toBeTruthy();
    expect(isNotUndefined("1")).toBeTruthy();
    expect(isNotUndefined("")).toBeTruthy();
    expect(isNotUndefined([1])).toBeTruthy();
    expect(isNotUndefined([])).toBeTruthy();
    expect(isNotUndefined({ 1: 1 })).toBeTruthy();
    expect(isNotUndefined({})).toBeTruthy();
  });

  it("can detect undefined values", () => {
    expect(isNotUndefined(undefined)).toBeFalsy();
  });
});

describe("#isAddUserFormValuesType", () => {
  it("can detect if the value is of the correct type", () => {
    expect(
      isAddUserFormValuesType({ email: "1@gmail.com", name: "rayner" })
    ).toBeTruthy();
    expect(isAddUserFormValuesType({ email: "", name: "rayner" })).toBeTruthy();
    expect(
      isAddUserFormValuesType({ email: "1@gmail.com", name: "" })
    ).toBeTruthy();
    expect(isAddUserFormValuesType({ email: "", name: "" })).toBeTruthy();
  });

  it("can detect if the value is of the wrong type", () => {
    expect(isAddUserFormValuesType({ name: "rayner" })).toBeFalsy();
    expect(isAddUserFormValuesType({ email: "1@gmail.com" })).toBeFalsy();
    expect(isAddUserFormValuesType({})).toBeFalsy();
  });
});

describe("#isArray", () => {
  it("can validate an array", () => {
    expect(isArray([])).toBeTruthy();
    expect(isArray([1])).toBeTruthy();
    expect(isArray([[1]])).toBeTruthy();
    expect(isArray([0])).toBeTruthy();
  });

  it("can invalidate a non-array", () => {
    expect(isArray(null)).toBeFalsy();
    expect(isArray(undefined)).toBeFalsy();
    expect(isArray(1)).toBeFalsy();
    expect(isArray("[1]")).toBeFalsy();
    expect(isArray({ 1: 1 })).toBeFalsy();
    expect(isArray({ 1: [1] })).toBeFalsy();
  });
});

describe("#isQuestion", () => {
  it("can validate a Question", () => {
    const validQuestion = {
      id: 1,
      sectionId: 1,
      deadlineId: 1,
      questionNumber: 1,
      question: "1",
      desc: "description",
      type: QUESTION_TYPE.SHORT_ANSWER,
    };
    expect(isQuestion(validQuestion)).toBeTruthy();
  });

  it("can invalidate an invalid Question", () => {
    expect(
      isQuestion({
        sectionId: 1,
        deadlineId: 1,
        questionNumber: 1,
        question: "1",
        desc: "description",
        type: QUESTION_TYPE.SHORT_ANSWER,
      })
    ).toBeFalsy();
    expect(isQuestion("Question")).toBeFalsy();
  });
});

describe("#isSection", () => {
  it("can validate a Section", () => {
    const validSection = {
      id: 1,
      deadlineId: 1,
      sectionNumber: 1,
      name: "Section",
      questions: [],
    };
    expect(isSection(validSection)).toBeTruthy();
  });

  it("can invalidate an invalid Section", () => {
    expect(
      isSection({
        id: 1,
        deadlineId: 1,
        sectionNumber: 1,
        name: "Section",
      })
    ).toBeFalsy();
    expect(isSection("Section")).toBeFalsy();
  });
});

describe("#isErrorType", () => {
  it("can validate an Error", () => {
    expect(isErrorType(new Error("error"))).toBeTruthy();
    expect(isErrorType({ message: "Error" })).toBeTruthy();
  });
  it("can invalidate a non-error", () => {
    expect(isErrorType("Error")).toBeFalsy();
  });
});

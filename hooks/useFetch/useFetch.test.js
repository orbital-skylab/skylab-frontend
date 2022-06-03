import { parseQueryParams } from "./useFetch.helpers";
import { describe, it, expect } from "jest";

describe("#parseQueryParams", () => {
  it("can transform zero params", () => {
    const parsed = parseQueryParams({});
    const expected = "";
    expect(parsed).toBe(expected);
  });

  it("can transform a single string param", () => {
    const parsed = parseQueryParams({ achievement: "Vostok" });
    const expected = "?achievement=Vostok";
    expect(parsed).toBe(expected);
  });

  it("can transform multiple string params", () => {
    const parsed = parseQueryParams({ achievement: "Vostok", page: 0 });
    const expected = "?achievement=Vostok&page=0";
    expect(parsed).toBe(expected);
  });

  it("can transform a single string array param with a single value", () => {
    const parsed = parseQueryParams({ achievement: ["Vostok"] });
    const expected = "?achievement=Vostok";
    expect(parsed).toBe(expected);
  });

  it("can transform a single string array param with multiple values", () => {
    const parsed = parseQueryParams({ achievement: ["Vostok", "Artemis"] });
    const expected = "?achievement=Vostok&achievement=Artemis";
    expect(parsed).toBe(expected);
  });

  it("can transform multiple string array params with a single value each", () => {
    const parsed = parseQueryParams({
      achievement: ["Vostok"],
      jedi: ["Anakin"],
    });
    const expected = "?achievement=Vostok&jedi=Anakin";
    expect(parsed).toBe(expected);
  });

  it("can transform multiple string array params with a multiple values each", () => {
    const parsed = parseQueryParams({
      achievement: ["Vostok", "Artemis"],
      sith: ["Darth", "Vader"],
    });
    const expected =
      "?achievement=Vostok&achievement=Artemis&sith=Darth&sith=Vader";
    expect(parsed).toBe(expected);
  });

  it("can transform multiple string array params with a mix of single and multiple values each", () => {
    const parsed = parseQueryParams({
      achievement: ["Vostok", "Artemis"],
      jedi: ["Obiwan"],
    });
    const expected = "?achievement=Vostok&achievement=Artemis&jedi=Obiwan";
    expect(parsed).toBe(expected);
  });

  it("can transform a mix of string and string array params with both single and multiple values", () => {
    const parsed = parseQueryParams({
      query: "HelloThere",
      achievement: ["Vostok", "Artemis"],
      jedi: ["Obiwan"],
    });
    const expected =
      "?query=HelloThere&achievement=Vostok&achievement=Artemis&jedi=Obiwan";
    expect(parsed).toBe(expected);
  });
});

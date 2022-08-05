/* eslint-disable no-undef */
import { describe, expect } from "@jest/globals";
import { splitOnCapital, splitOnHyphen, validateUrl } from "./string";

describe("#splitOnCapital", () => {
  it("can split words with multiple capitals", () => {
    expect(splitOnCapital("ThisIsAPhrase")).toBe("This Is A Phrase");
  });

  it("it does not split words with a single capital", () => {
    expect(splitOnCapital("Wordandword")).toBe("Wordandword");
  });

  it("it does not split words with no capitals", () => {
    expect(splitOnCapital("therearenocapitals")).toBe("therearenocapitals");
  });
});

describe("#splitOnHyphen", () => {
  it("can split words with multiple hyphens", () => {
    expect(splitOnHyphen("this-is-a-phrase")).toBe("This Is A Phrase");
  });

  it("it splits words with a single hyphen", () => {
    expect(splitOnHyphen("word-word")).toBe("Word Word");
  });

  it("it does not split words with a single hyphen at the start", () => {
    expect(splitOnHyphen("-wordword")).toBe("Wordword");
  });

  it("it does not split words with a single hyphen at the end", () => {
    expect(splitOnHyphen("wordword-")).toBe("Wordword");
  });

  it("it does not split words with no capitals", () => {
    expect(splitOnHyphen("therearenohyphens")).toBe("Therearenohyphens");
  });

  it("it can capitalize provided acronyms", () => {
    expect(splitOnHyphen("these-are-pdf-csv-acronyms", ["pdf", "CSV"])).toBe(
      "These Are PDF CSV Acronyms"
    );
  });
});

describe("#validateUrl", () => {
  it("can validate valid URLs", () => {
    expect(validateUrl("https://skylab-frontend.vercel.app/")).toBeTruthy();
    expect(validateUrl("https://www.google.com/")).toBeTruthy();
    expect(validateUrl("http://localhost:3000")).toBeTruthy();
  });

  it("can detect invalid URLs", () => {
    expect(validateUrl("skylab.com")).toBeFalsy();
    expect(validateUrl("Google Drive")).toBeFalsy();
    expect(validateUrl("http//url?")).toBeFalsy();
  });
});

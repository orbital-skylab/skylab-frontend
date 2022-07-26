/* eslint-disable @typescript-eslint/no-explicit-any */
import { Error } from "@/types/api";
import { Question, Section } from "@/types/deadlines";
import { AddUserFormValuesType } from "@/types/roles";

/**
 * To validate that a type is not undefined
 */
export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

/**
 * To validate that values are of type AddUserFormValuesType
 */
export function isAddUserFormValuesType(
  values: any
): values is AddUserFormValuesType {
  return values.email !== undefined && values.name !== undefined;
}

/** To validate that values are an array */
export function isArray<T>(values: any): values is Array<T> {
  return values && typeof values === "object" && values.length !== undefined;
}

/** To validate that values is a Question */
export function isQuestion(value: any): value is Question {
  return (
    value &&
    value.id !== undefined &&
    value.deadlineId !== undefined &&
    value.questionNumber !== undefined &&
    value.question &&
    value.desc !== undefined &&
    value.type
  );
}

/** To validate that values is a Section */
export function isSection(value: any): value is Section {
  return (
    value &&
    value.id !== undefined &&
    value.deadlineId !== undefined &&
    value.sectionNumber !== undefined &&
    value.name !== undefined &&
    value.questions
  );
}

export function isErrorType(value: any): value is Error {
  return value && value.message;
}

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

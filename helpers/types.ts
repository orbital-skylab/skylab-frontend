/* eslint-disable @typescript-eslint/no-explicit-any */
import { Question } from "@/types/deadlines";
import { AddUserFormValuesType } from "@/types/roles";

/**
 * To validate that a type is not undefined
 */
export function isNotUndefined<T>(value: T | undefined): value is T {
  return !!value;
}

/**
 * To validate that values are of type AdduserFormValuesType
 */
export function isAddUserFormValuesType(
  values: any
): values is AddUserFormValuesType {
  return values.email && values.name;
}

/** To validate that values are an array */
export function isArray<T>(values: any): values is Array<T> {
  return values && typeof values === "object" && values.length !== undefined;
}

/** To validate that values */
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

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

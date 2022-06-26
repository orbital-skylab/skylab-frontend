import { AddUserFormValuesType } from "@/types/roles";

/**
 * To validate that values are of type AdduserFormValuesType
 */
export function isAddUserFormValuesType(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  values: any
): values is AddUserFormValuesType {
  return values.email && values.name;
}

/** To validate that values are an array */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isArray<T>(values: any): values is Array<T> {
  return values && typeof values === "object" && values.length !== undefined;
}

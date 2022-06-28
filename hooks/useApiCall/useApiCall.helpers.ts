import { CALL_STATUS } from "./useApiCall.types";

export function isCalling(...statuses: CALL_STATUS[]) {
  return statuses.reduce(
    (acc, val) => acc || val === CALL_STATUS.CALLING,
    false
  );
}

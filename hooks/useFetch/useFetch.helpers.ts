import {
  FETCH_STATUS,
  ACTION_TYPE,
  State,
  Action,
  Mutator,
} from "./useFetch.types";

export const createReducer =
  <T>() =>
  (state: State<T>, action: Action<T>): State<T> => {
    switch (action.type) {
      case ACTION_TYPE.SET_STATUS_FETCHING: {
        return { ...state, status: FETCH_STATUS.FETCHING };
      }
      case ACTION_TYPE.SET_FETCHED_DATA: {
        return {
          ...state,
          status: FETCH_STATUS.FETCHED,
          data: action.payload as T,
        };
      }
      case ACTION_TYPE.MUTATE: {
        const newState = { ...state };
        const mutator = action.payload as Mutator<T>;
        if (mutator) {
          newState.data = mutator(newState.data as T);
        }
        return newState;
      }
      case ACTION_TYPE.SET_ERROR: {
        return { ...state, status: FETCH_STATUS.ERROR, error: action.payload };
      }
      default: {
        return state;
      }
    }
  };

export function isFetching(...statuses: FETCH_STATUS[]) {
  return statuses.reduce(
    (acc, val) =>
      acc || val === FETCH_STATUS.FETCHING || val === FETCH_STATUS.IDLE,
    false
  );
}

export function isError(...statuses: FETCH_STATUS[]) {
  return statuses.reduce(
    (acc, val) => acc || val === FETCH_STATUS.ERROR,
    false
  );
}

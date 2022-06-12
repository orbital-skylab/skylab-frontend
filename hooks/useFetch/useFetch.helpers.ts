import {
  FETCH_STATUS,
  ACTION_TYPE,
  State,
  Action,
  Mutator,
  QueryParams,
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

export function parseQueryParams(queryParams: QueryParams | undefined): string {
  if (queryParams === undefined) {
    return "";
  }

  const queryParamsCopy = { ...queryParams };

  let parsedQueryParams = "?";
  let numberOfInvalidParams = 0;

  for (const [query, param] of Object.entries(queryParamsCopy)) {
    if (param instanceof Array) {
      for (const val of param) {
        parsedQueryParams += `${query}=${val}&`;
      }
    } else if (typeof param === "number" || param) {
      parsedQueryParams += `${query}=${param}&`;
    } else {
      numberOfInvalidParams++;
    }
  }

  if (numberOfInvalidParams === Object.keys(queryParams).length) {
    return "";
  }

  // To remove the last '&'
  return parsedQueryParams.slice(0, parsedQueryParams.length - 1);
}

export function isFetching(...statuses: FETCH_STATUS[]) {
  return statuses.reduce(
    (acc, val) => acc || val === FETCH_STATUS.FETCHING,
    false
  );
}

export function isError(...statuses: FETCH_STATUS[]) {
  return statuses.reduce(
    (acc, val) => acc || val === FETCH_STATUS.ERROR,
    false
  );
}

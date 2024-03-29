import { useEffect, useReducer } from "react";
import { createReducer } from "./useFetch.helpers";
import {
  FETCH_STATUS,
  ACTION_TYPE,
  State,
  Mutate,
  HookReturnType,
} from "./useFetch.types";
import { ApiServiceBuilder } from "@/helpers/api";
import { HTTP_METHOD, QueryParams } from "@/types/api";
import { isErrorType } from "@/helpers/types";

/**
 * A custom wrapper hook to fetch data while providing state and the ability to update the fetched data manually.
 * @param {string} param0.endpoint the endpoint of where to fetch data from (the apiservicebuilder automatically prepends the backend api url).
 * @param {boolean} param0.requiresAuthorization whether the endpoint requires the user to be authorized.
 * @param {QueryParam} param0.queryParam the parameter queries to be sent. Take note the object MUST be memoized using `useMemo` else the function will fire infinitely
 * @param {(data: T) => void} param0.onFetch receives a callback that is invoked upon successfully fetching any data
 * @returns an object where status is the status of fetching the data, error is any encountered error (if any), data is the data fetched, and mutate is a function that takes in a callback to modify the data.
 */
const useFetch = <T>({
  endpoint = "",
  requiresAuthorization = true,
  queryParams,
  onFetch,
  enabled = true,
}: {
  endpoint: string;
  requiresAuthorization?: boolean;
  queryParams?: QueryParams;
  onFetch?: (data: T) => void;
  enabled?: boolean;
}): HookReturnType<T> => {
  /* Initializing reducer. */
  const initialState: State<T> = {
    status: FETCH_STATUS.IDLE,
    error: null,
    data: undefined,
  };
  const reducer = createReducer<T>();
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchData = async (cancelRequest: boolean) => {
    dispatch({ type: ACTION_TYPE.SET_STATUS_FETCHING });
    try {
      /* Building API service. */
      const apiServiceBuilder = new ApiServiceBuilder({
        method: HTTP_METHOD.GET,
        endpoint,
        queryParams,
        requiresAuthorization,
      });
      const apiService = apiServiceBuilder.build();

      const response = await apiService();
      const data: T = await response.json();
      if (cancelRequest) return;

      if (isErrorType(data)) {
        throw new Error(data.message);
      }

      dispatch({ type: ACTION_TYPE.SET_FETCHED_DATA, payload: data });
      if (onFetch) {
        onFetch(data);
      }
    } catch (error) {
      if (cancelRequest) return;
      const payloadError =
        error instanceof Error ? error.message : (error as string);
      dispatch({
        type: ACTION_TYPE.SET_ERROR,
        payload: payloadError,
      });
    }
  };

  useEffect(() => {
    let cancelRequest = false;

    if (enabled) {
      fetchData(cancelRequest);
    }

    return function cleanup() {
      cancelRequest = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, requiresAuthorization, queryParams]);

  /* Mutate function to modify the state of the fetched data directly. */
  const mutate: Mutate<T> = async (mutator) => {
    dispatch({ type: ACTION_TYPE.MUTATE, payload: mutator });
  };

  const refetch = () => fetchData(false);

  return { ...state, mutate, refetch };
};

export default useFetch;

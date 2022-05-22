import { useEffect, useReducer } from "react";
import { createReducer } from "./useFetch.helpers";
import {
  STATUS,
  ACTION_TYPE,
  State,
  Mutate,
  HookReturnType,
} from "./useFetch.types";
import { ApiServiceBuilder, HTTP_METHOD } from "@/helpers/api";

/**
 * a custom wrapper hook to fetch data while providing state and the ability to update the fetched data manually.
 * @param {string} param0.endpoint the endpoint of where to fetch data from (the apiservicebuilder automatically prepends the backend api url).
 * @param {boolean} param0.requiresAuthorization whether the endpoint requires the user to be authorized.
 * @returns an object where status is the status of fetching the data, error is any encountered error (if any), data is the data fetched, and mutate is a function that takes in a callback to modify the data.
 */
const useFetch = <T>({
  endpoint = "",
  requiresAuthorization = false,
}: {
  endpoint: string;
  requiresAuthorization?: boolean;
}): HookReturnType<T> => {
  const token = "placeholderToken"; // TODO: Retrieve from useAuth

  /* Initializing reducer. */
  const initialState: State<T> = {
    status: STATUS.IDLE,
    error: null,
    data: undefined,
  };
  const reducer = createReducer<T>();
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelRequest = false;

    const fetchData = async () => {
      dispatch({ type: ACTION_TYPE.SET_STATUS_FETCHING });
      try {
        /* Building API service. */
        const apiServiceBuilder = new ApiServiceBuilder();
        apiServiceBuilder.setMethod(HTTP_METHOD.GET);
        apiServiceBuilder.setEndpoint(endpoint);
        if (requiresAuthorization) {
          apiServiceBuilder.setToken(token);
        }
        const apiService = apiServiceBuilder.build();

        const response = await apiService();
        const data: T = await response.json();
        if (cancelRequest) return;
        dispatch({ type: ACTION_TYPE.SET_FETCHED_DATA, payload: data });
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
    fetchData();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [endpoint, requiresAuthorization]);

  /* Mutate function to modify the state of the fetched data directly. */
  const mutate: Mutate<T> = async (mutator) => {
    dispatch({ type: ACTION_TYPE.MUTATE, payload: mutator });
  };

  return { ...state, mutate };
};

export default useFetch;

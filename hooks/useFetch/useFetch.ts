import { useEffect, useReducer } from "react";
import { createReducer } from "./useFetch.helpers";
import {
  STATUS,
  ACTION_TYPE,
  State,
  Mutate,
  HookReturnType,
} from "./useFetch.types";
import { API_URL } from "@/lib/constants";

const useFetch = <T>(url: string): HookReturnType<T> => {
  const initialState: State<T> = {
    status: STATUS.IDLE,
    error: null,
    data: undefined,
  };
  const reducer = createReducer<T>();

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelRequest = false;
    if (!url || !url.trim()) return;

    const fetchData = async () => {
      dispatch({ type: ACTION_TYPE.SET_STATUS_FETCHING });
      try {
        const response = await fetch(`${API_URL}${url}`);
        const data = await response.json();
        if (cancelRequest) return;
        dispatch({ type: ACTION_TYPE.SET_FETCHED_DATA, payload: { data } });
      } catch (error) {
        if (cancelRequest) return;
        const payloadError =
          error instanceof Error ? error.message : (error as string);
        dispatch({
          type: ACTION_TYPE.SET_ERROR,
          payload: { error: payloadError },
        });
      }
    };

    fetchData();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [url]);

  const mutate: Mutate<T> = async (mutator) => {
    dispatch({ type: ACTION_TYPE.MUTATE, payload: { mutator } });
  };

  return { ...state, mutate };
};

export default useFetch;

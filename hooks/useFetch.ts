import { useEffect, useRef, useReducer } from "react";

enum STATUS {
  IDLE,
  FETCHING,
  FETCHED,
  ERROR,
}

interface State<DataType> {
  status: STATUS;
  error: unknown;
  data: DataType | undefined;
}

interface Action {
  type: STATUS;
  payload?: any;
}

function reducer<DataType>(state: State<DataType>, action: Action) {
  switch (action.type) {
    case STATUS.FETCHING: {
      return { ...state, status: STATUS.FETCHING };
    }
    case STATUS.FETCHED: {
      return {
        ...state,
        status: STATUS.FETCHED,
        data: action.payload,
      };
    }
    case STATUS.ERROR: {
      return { ...state, status: STATUS.ERROR, error: action.payload };
    }
    default: {
      return state;
    }
  }
}

const useFetch = <DataType>(url: string): State<DataType> => {
  const cache = useRef({});

  const initialState: State<DataType> = {
    status: STATUS.IDLE,
    error: null,
    data: undefined,
  };

  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let cancelRequest = false;
    if (!url || !url.trim()) return;

    const fetchData = async () => {
      dispatch({ type: STATUS.FETCHING });
      if (cache.current[url]) {
        const data = cache.current[url];
        dispatch({ type: STATUS.FETCHED, payload: data });
      } else {
        try {
          const response = await fetch(url);
          const data = await response.json();
          cache.current[url] = data;
          if (cancelRequest) return;
          dispatch({ type: STATUS.FETCHED, payload: data });
        } catch (error) {
          if (cancelRequest) return;
          let payload = error instanceof Error ? error.message : error;
          dispatch({ type: STATUS.ERROR, payload });
        }
      }
    };

    fetchData();

    return function cleanup() {
      cancelRequest = true;
    };
  }, [url]);

  return state;
};

export default useFetch;

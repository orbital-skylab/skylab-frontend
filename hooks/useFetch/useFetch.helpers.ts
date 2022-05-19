import { STATUS, ACTION_TYPE, State, Action } from "./useFetch.types";

export const createReducer =
  <DataType>() =>
  (state: State<DataType>, action: Action<DataType>): State<DataType> => {
    switch (action.type) {
      case ACTION_TYPE.SET_STATUS_FETCHING: {
        return { ...state, status: STATUS.FETCHING };
      }
      case ACTION_TYPE.SET_FETCHED_DATA: {
        return {
          ...state,
          status: STATUS.FETCHED,
          data: action.payload?.data,
        };
      }
      case ACTION_TYPE.MUTATE: {
        const newState = { ...state };
        const mutator = action.payload?.mutator;
        if (mutator) {
          newState.data = mutator(newState.data as DataType);
        }
        return newState;
      }
      case ACTION_TYPE.SET_ERROR: {
        return { ...state, status: STATUS.ERROR, error: action.payload?.error };
      }
      default: {
        return state;
      }
    }
  };

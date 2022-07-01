export enum FETCH_STATUS {
  IDLE = "IDLE",
  FETCHING = "FETCHING",
  FETCHED = "FETCHED",
  ERROR = "ERROR",
}

export enum ACTION_TYPE {
  SET_STATUS_FETCHING,
  SET_FETCHED_DATA,
  SET_ERROR,
  MUTATE,
}

/**
 * Mutate function takes in a callback which modifies the data optimistically.
 */
export type Mutator<T> = (data: T) => T;
export type Mutate<T> = (mutator: Mutator<T>) => void;

/**
 * The state of the reducer with a generic data type.
 */
export interface State<T> {
  status: FETCH_STATUS;
  error: unknown;
  data: T | undefined;
}

/**
 * Type of reducer actions with a generic data type.
 */
export interface Action<T> {
  type: ACTION_TYPE;
  payload?: T | Mutator<T> | unknown;
}

/**
 * The return type of the useFetch hook.
 */
export interface HookReturnType<T> extends State<T> {
  mutate: Mutate<T>;
  refetch: () => void;
}

/**
 * The type of query params.
 */
export type QueryParams = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

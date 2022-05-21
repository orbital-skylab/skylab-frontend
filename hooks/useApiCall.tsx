import { useState } from "react";

enum STATUS {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}
/**
 * A custom wrapper hook to make POST and PUT API requests while providing state.
 * @param apiService The API service to call.
 */
// TODO: Fix any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useApiCall = (createServiceWithToken: any, onSuccess: any) => {
  const token = "placeholderToken"; // TODO: Retrieve from useAuth
  const [status, setStatus] = useState<STATUS>(STATUS.IDLE);
  const [error, setError] = useState("");
  const apiService = createServiceWithToken(token);

  async function call() {
    setStatus(STATUS.LOADING);

    try {
      const res = await apiService();

      if (!res.ok) {
        const error = await res.json();
        throw error;
      }

      if (onSuccess) {
        const data = await res.json();
        onSuccess(data);
      }

      setStatus(STATUS.SUCCESS);
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : (error as string));
      setStatus(STATUS.ERROR);
    }
  }

  return { status, call, error };
};

export default useApiCall;

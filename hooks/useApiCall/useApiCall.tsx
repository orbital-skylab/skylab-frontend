/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiServiceBuilder } from "@/helpers/api";
import { HTTP_METHOD } from "@/types/api";
import { CALL_STATUS } from "./useApiCall.types";
import { useState } from "react";

/**
 * A custom wrapper hook to make API requests while providing state.
 * @param {HTTP_METHOD} param0.method the HTTP method to invoke.
 * @param {string} param0.endpoint the endpoint of where to make the request to (the apiservicebuilder automatically prepends the backend api url).
 * @param {{key: string}: any} param0.body the body of the request.
 * @param {boolean} param0.requiresAuthorization whether the endpoint requires the user to be authorized.
 * @param {Function} param0.onSuccess the function called when the function is successful
 * @param {Function} param0.onError the function called when the function has an error
 * @returns an object where status is the status of the request, error is any encountered error (if any), call is the function to actually make the api request.

 */
const useApiCall = ({
  method = HTTP_METHOD.POST,
  endpoint = "",
  body = {},
  requiresAuthorization = true,
  onSuccess,
  onError,
}: {
  method?: HTTP_METHOD;
  endpoint: string;
  body?: { [key: string]: any };
  requiresAuthorization?: boolean;
  onSuccess?: <T>(data: T) => void;
  onError?: (error: string) => void;
}) => {
  const token = "placeholderToken"; // TODO: Retrieve from useAuth
  const [status, setStatus] = useState<CALL_STATUS>(CALL_STATUS.IDLE);
  const [error, setError] = useState("");

  /* Building API service. */
  const apiServiceBuilder = new ApiServiceBuilder({ method, endpoint, body });
  if (requiresAuthorization) {
    apiServiceBuilder.setToken(token);
  }

  /* Calls the actual API call with the specified api service. */
  async function call(body?: { [key: string]: any }) {
    setStatus(CALL_STATUS.LOADING);

    try {
      if (requiresAuthorization && !token) {
        throw new Error("User is unauthorized");
      }
      if (body) {
        apiServiceBuilder.setBody(body);
      }

      const apiService = apiServiceBuilder.build();
      const res = await apiService();

      if (!res.ok) {
        const error = await res.json();
        throw error;
      }

      if (onSuccess) {
        const data = await res.json();
        onSuccess(data);
      }

      setStatus(CALL_STATUS.SUCCESS);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (onError) {
        onError(errorMessage);
      }
      setError(errorMessage);
      setStatus(CALL_STATUS.ERROR);
      throw errorMessage;
    }
  }

  return { status, error, call };
};

export default useApiCall;

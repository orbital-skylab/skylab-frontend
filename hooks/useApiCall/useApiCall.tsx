/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApiServiceBuilder } from "@/helpers/api";
import { Error as ErrorType, HTTP_METHOD } from "@/types/api";
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
  requiresAuthorization = true,
  body = {},
  onSuccess,
  onError,
}: {
  method?: HTTP_METHOD;
  endpoint?: string;
  body?: { [key: string]: any };
  requiresAuthorization?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}) => {
  const [status, setStatus] = useState<CALL_STATUS>(CALL_STATUS.IDLE);

  /* Building API service. */
  const apiServiceBuilder = new ApiServiceBuilder({
    method,
    endpoint,
    body,
    requiresAuthorization,
  });

  function setEndpoint(endpoint: string) {
    apiServiceBuilder.setEndpoint(endpoint);
  }

  /* Calls the actual API call with the specified api service. */
  async function call(body?: { [key: string]: any }) {
    setStatus(CALL_STATUS.CALLING);
    try {
      if (body) {
        apiServiceBuilder.setBody(body);
      }
      const apiService = apiServiceBuilder.build();
      const res = await apiService();
      if (!res.ok) {
        let errorMessage = "";
        try {
          errorMessage = ((await res.json()) as ErrorType).message;
        } catch {
          errorMessage =
            "An error has occurred. Please check the Network tab and inform the developers.";
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();
      if (onSuccess) {
        onSuccess(data);
      }

      setStatus(CALL_STATUS.SUCCESS);
      return data;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (onError) {
        onError(errorMessage);
      }
      setStatus(CALL_STATUS.ERROR);
      throw error;
    }
  }

  return { status, setEndpoint, call };
};

export default useApiCall;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONTENT_TYPE, HTTP_METHOD, QueryParams } from "@/types/api";

/**
 * Constants
 */
export const API_URL = `${process.env.NEXT_PUBLIC_BASE_DEV_API_URL}`;
export class ApiServiceBuilder {
  private endpoint: string;
  private queryParams: QueryParams;
  private body: { [key: string]: any };
  private method: HTTP_METHOD;
  private contentType: CONTENT_TYPE;
  private requiresAuthorization: boolean;

  constructor({
    method = HTTP_METHOD.GET,
    endpoint = "",
    body = {},
    queryParams = {},
    contentType = CONTENT_TYPE.JSON,
    requiresAuthorization = false,
  }: {
    method?: HTTP_METHOD;
    endpoint?: string;
    body?: Record<string, any>;
    queryParams?: QueryParams;
    contentType?: CONTENT_TYPE;
    requiresAuthorization?: boolean;
  } = {}) {
    this.method = method;
    this.endpoint = endpoint;
    this.body = body;
    this.queryParams = queryParams;
    this.contentType = contentType;
    this.requiresAuthorization = requiresAuthorization;
  }

  public checkParameters() {
    console.log("Method:", this.method);
    console.log("Endpoint:", this.endpoint);
    console.log("Body:", this.body);
    console.log("Content-Type:", this.contentType);
    console.log("Requires Authorization:", this.requiresAuthorization);
  }

  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;
    return this;
  }

  setQueryParams(queryParams: QueryParams) {
    this.queryParams = queryParams;
    return this;
  }

  setBody(body: { [key: string]: any }) {
    this.body = body;
    return this;
  }

  setMethod(method: HTTP_METHOD) {
    this.method = method;
    return this;
  }

  setContentType(contentType: CONTENT_TYPE) {
    this.contentType = contentType;
    return this;
  }

  setRequiresAuthorization(requiresAuthorization: boolean) {
    this.requiresAuthorization = requiresAuthorization;
    return this;
  }

  build() {
    const requestResource = `${API_URL}${this.endpoint}`;
    const requestResourceWithQueryParams =
      requestResource + parseQueryParams(this.queryParams);

    const requestInit: RequestInit = {};

    requestInit.method = this.method;

    if (this.method !== HTTP_METHOD.GET) {
      requestInit.headers = {
        ...requestInit.headers,
        "Content-Type": this.contentType,
      };
    }

    if (Object.keys(this.body).length > 0) {
      requestInit.body = JSON.stringify(this.body);
    }

    if (this.requiresAuthorization) {
      requestInit.credentials = "include";
    }

    const apiService = (): Promise<any> => {
      return fetch(requestResourceWithQueryParams, requestInit);
    };
    return apiService;
  }
}

export function parseQueryParams(queryParams: QueryParams | undefined): string {
  if (queryParams === undefined) {
    return "";
  }

  const queryParamsCopy = { ...queryParams };

  let parsedQueryParams = "?";
  let numberOfInvalidParams = 0;

  for (const [query, param] of Object.entries(queryParamsCopy)) {
    if (Array.isArray(param)) {
      for (const val of param) {
        parsedQueryParams += `${query}=${val}&`;
      }
    } else if (param !== undefined && param !== null && param !== "") {
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

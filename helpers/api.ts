/* eslint-disable @typescript-eslint/no-explicit-any */
import { CONTENT_TYPE, HTTP_METHOD } from "@/types/api";

/**
 * Constants
 */
export const API_URL = `${process.env.NEXT_PUBLIC_BASE_DEV_API_URL}`;
export class ApiServiceBuilder {
  private endpoint: string;
  private body: { [key: string]: any };
  private method: HTTP_METHOD;
  private contentType: CONTENT_TYPE;
  private requiresAuthorization: boolean;

  constructor({
    method = HTTP_METHOD.GET,
    endpoint = "",
    body = {},
    contentType = CONTENT_TYPE.JSON,
    requiresAuthorization = false,
  }: {
    method?: HTTP_METHOD;
    endpoint?: string;
    body?: Record<string, any>;
    contentType?: CONTENT_TYPE;
    requiresAuthorization?: boolean;
  } = {}) {
    this.method = method;
    this.endpoint = endpoint;
    this.body = body;
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

    const apiService = async () => {
      return await fetch(requestResource, requestInit);
    };
    return apiService;
  }
}

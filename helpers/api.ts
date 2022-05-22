/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Constants
 */
export const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}`;

/**
 * Helper functions
 */
export enum HTTP_METHOD {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  PATCH = "PATCH",
  DELETE = "DELETE",
}

export enum CONTENT_TYPE {
  JSON = "application/json",
}

export class ApiServiceBuilder {
  private endpoint: string;
  private body: { [key: string]: any };
  private method: HTTP_METHOD;
  private contentType: CONTENT_TYPE;
  private token: string;

  constructor(
    method = HTTP_METHOD.GET,
    endpoint = "",
    body = {},
    contentType = CONTENT_TYPE.JSON,
    token = ""
  ) {
    this.method = method;
    this.endpoint = endpoint;
    this.body = body;
    this.contentType = contentType;
    this.token = token;
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

  setToken(token: string) {
    this.token = token;
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

    if (this.token !== "") {
      requestInit.headers = {
        ...requestInit.headers,
        authorization: `Bearer ${this.token}`,
      };
    }

    const apiService = async () => {
      return await fetch(requestResource, requestInit);
    };
    return apiService;
  }
}

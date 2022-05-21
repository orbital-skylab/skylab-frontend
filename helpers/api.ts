/**
 * Constants
 */
export const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}`;

/**
 * Helper functions
 */
export async function PostApiService(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: { [key: string]: any }
) {
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return res;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function curryPostApiService(url: string, body: { [key: string]: any }) {
  function createServiceWithToken(token: string) {
    async function postApiService() {
      const res = await fetch(`${API_URL}${url}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      return res;
    }
    return postApiService;
  }
  return createServiceWithToken;
}

import { ApiServiceBuilder } from "@/helpers/api";
import { HTTP_METHOD, QueryParams } from "@/types/api";
import { useEffect, useState } from "react";
import { FETCH_STATUS, Mutate } from "@/hooks/useFetch";

/**
 * U is the shape of the API response, T is the shape of a single element
 */
export default function useInfiniteFetch<U, T>({
  endpoint,
  queryParams,
  page,
  requiresAuthorization = true,
  responseToData,
  enabled = true,
}: {
  endpoint: string;
  queryParams: QueryParams;
  page: number;
  requiresAuthorization?: boolean;
  responseToData: (response: U) => T[];
  enabled?: boolean;
}) {
  const [status, setStatus] = useState<FETCH_STATUS>(FETCH_STATUS.IDLE);
  const [error, setError] = useState("");
  const [data, setData] = useState<T[]>([]); // Uses the `responseToData` function to extract out the data to be paginated infinitely
  const [originalData, setOriginalData] = useState<U[]>([]); // An array of the original (unextracted) data that is fetched from the API
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setStatus(FETCH_STATUS.FETCHING);
      setError("");

      if (page === 0) {
        setData([]);
      }

      try {
        /* Building API service. */
        const apiServiceBuilder = new ApiServiceBuilder({
          method: HTTP_METHOD.GET,
          endpoint,
          queryParams: { ...queryParams, page },
          requiresAuthorization,
        });
        const apiService = apiServiceBuilder.build();

        const response = await (await apiService()).json();
        const data = responseToData(response);
        if (page === 0) {
          if (data && data.length !== undefined) {
            setData(data);
          }
          setOriginalData(response);
        } else {
          if (data && data.length !== undefined) {
            setData((prevData) => [...prevData, ...data]);
          }
          setOriginalData((prevOriginalData) => [
            ...prevOriginalData,
            ...response,
          ]);
        }
        setHasMore(data.length > 0);
        setStatus(FETCH_STATUS.FETCHED);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
        setStatus(FETCH_STATUS.ERROR);
      }
    };

    if (enabled) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, queryParams, page]);

  /* Mutate function to modify the state of the fetched data directly. */
  const mutate: Mutate<T[]> = async (mutator) => {
    const mutatedData = mutator([...data]);
    setData(mutatedData);
  };

  return { status, error, data, originalData, hasMore, mutate };
}

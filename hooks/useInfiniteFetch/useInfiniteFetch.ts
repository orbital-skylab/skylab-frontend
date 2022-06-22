import { ApiServiceBuilder } from "@/helpers/api";
import { HTTP_METHOD } from "@/types/api";
import { useEffect, useState } from "react";
import { FETCH_STATUS, parseQueryParams, QueryParams } from "@/hooks/useFetch";

export default function useInfiniteFetch<T>({
  endpoint,
  queryParams,
  page,
  requiresAuthorization = false,
}: {
  endpoint: string;
  queryParams: QueryParams;
  page: number;
  requiresAuthorization?: boolean;
}) {
  const [status, setStatus] = useState<FETCH_STATUS>(FETCH_STATUS.IDLE);
  const [error, setError] = useState("");
  const [data, setData] = useState<T[]>([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setData([]);
  }, [queryParams]);

  useEffect(() => {
    const fetchData = async () => {
      setStatus(FETCH_STATUS.FETCHING);
      setError("");

      try {
        /* Building API service. */
        const endpointWithQueryParams =
          endpoint + parseQueryParams({ ...queryParams, page });

        const apiServiceBuilder = new ApiServiceBuilder({
          method: HTTP_METHOD.GET,
          endpoint: endpointWithQueryParams,
          requiresAuthorization,
        });
        const apiService = apiServiceBuilder.build();

        const response = await apiService();
        const data: T[] = await response.json();
        setData((prevData) => [...prevData, ...data]);
        setHasMore(data.length > 0);
        setStatus(FETCH_STATUS.FETCHED);
      } catch (error) {
        setError(error instanceof Error ? error.message : String(error));
        setStatus(FETCH_STATUS.ERROR);
      }
    };
    fetchData();
  }, [endpoint, requiresAuthorization, queryParams, page]);

  return { status, error, data, hasMore };
}

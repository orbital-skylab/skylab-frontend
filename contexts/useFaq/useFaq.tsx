import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { IFaq } from "./useFaq.types";
import useFetch from "@/hooks/useFetch";
import { GetFaqConversationsResponse, HTTP_METHOD } from "@/types/api";
import { FaqConversation } from "@/types/ai";
import { ApiServiceBuilder } from "@/helpers/api";

const FaqContext = createContext<IFaq>({
  conversations: [],
  isFetching: false,
  hasMore: true,

  loadMore: () => {
    return;
  },
  resetConversations: () => {
    return;
  },
  removeConversation: async () => {
    return;
  },
  removeConversations: async () => {
    return;
  },
  addConversation: async () => {
    return {} as FaqConversation;
  },
});

const PAGE_SIZE = 25;
export const FaqProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState(0);
  const [conversations, setConversations] = useState<FaqConversation[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const { data, status } = useFetch<GetFaqConversationsResponse>({
    endpoint: "/ai/faq",
    enabled: hasMore,
    queryParams: {
      limit: PAGE_SIZE,
      page,
      order: "desc",
    },
  });

  // Append incoming conversations if data changes
  useEffect(() => {
    if (!data?.faqConversations) return;

    setHasMore(data.hasMore);
    setConversations((prev) => {
      const existing = new Set(prev.map((c) => c.id));
      const uniqueIncoming = data.faqConversations.filter(
        (c) => !existing.has(c.id)
      );
      return [...prev, ...uniqueIncoming];
    });
  }, [data]);

  const loadMore = useCallback(() => {
    if (status === "FETCHING" || !hasMore) return;
    setPage((p) => p + 1);
  }, [status, hasMore]);

  const resetConversations = () => {
    setConversations([]);
    setPage(0);
    setHasMore(true);
  };

  const addConversation = async (content: string) => {
    const apiService = new ApiServiceBuilder({
      method: HTTP_METHOD.POST,
      endpoint: "/ai/faq",
      body: { content },
      requiresAuthorization: true,
      stream: true,
    }).build();

    const response = await apiService();
    const { conversation } = await response.json();
    setConversations((prev) => [...prev, conversation]);

    return conversation;
  };

  const removeConversation = useCallback(async (id: number) => {
    if (typeof id !== "number") return;

    const apiService = new ApiServiceBuilder({
      method: HTTP_METHOD.DELETE,
      endpoint: `/ai/faq/${id}`,
      requiresAuthorization: true,
    }).build();

    await apiService();
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const removeConversations = useCallback(async (ids: number[]) => {
    if (!Array.isArray(ids) || ids.length === 0) return;

    const apiService = new ApiServiceBuilder({
      method: HTTP_METHOD.DELETE,
      endpoint: `/ai/faq/bulk`,
      body: { conversationIds: ids },
      requiresAuthorization: true,
    }).build();

    await apiService();
    setConversations((prev) => prev.filter((c) => !ids.includes(c.id)));
  }, []);

  const value = useMemo(
    () => ({
      conversations,
      isFetching: status === "FETCHING",
      hasMore,
      loadMore,
      resetConversations,
      removeConversation,
      removeConversations,
      addConversation,
    }),
    [
      conversations,
      status,
      hasMore,
      loadMore,
      removeConversations,
      removeConversation,
    ]
  );

  return <FaqContext.Provider value={value}>{children}</FaqContext.Provider>;
};

export default function useFaq() {
  return useContext(FaqContext);
}

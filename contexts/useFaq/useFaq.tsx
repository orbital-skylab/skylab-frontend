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
import { GetFaqConversationsResponse } from "@/types/api";
import { FaqConversation } from "@/types/ai";

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
  removeConversation: () => {
    return;
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

  // Append incoming conversations
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

  const removeConversation = (id: number) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
  };

  const value = useMemo(
    () => ({
      conversations,
      isFetching: status === "FETCHING",
      hasMore,
      loadMore,
      resetConversations,
      removeConversation,
    }),
    [conversations, status, hasMore, loadMore]
  );

  return <FaqContext.Provider value={value}>{children}</FaqContext.Provider>;
};

export default function useFaq() {
  return useContext(FaqContext);
}

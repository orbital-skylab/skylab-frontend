import { FaqConversation } from "@/types/ai";

export interface IFaq {
  conversations: FaqConversation[];
  isFetching: boolean;
  hasMore: boolean;

  loadMore: () => void;
  resetConversations: () => void;
  removeConversation: (id: number) => void;
}

export interface FaqProviderProps {
  children?: React.ReactNode;
}

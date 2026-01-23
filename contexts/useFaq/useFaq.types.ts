import { FaqConversation } from "@/types/ai";

export interface IFaq {
  conversations: FaqConversation[];
  isFetching: boolean;
  hasMore: boolean;

  loadMore: () => void;
  resetConversations: () => void;
  removeConversation: (id: number) => Promise<void>;
  removeConversations: (ids: number[]) => Promise<void>;
  addConversation: (content: string) => Promise<FaqConversation>;
}

export interface FaqProviderProps {
  children?: React.ReactNode;
}

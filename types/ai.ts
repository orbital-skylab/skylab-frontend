export type MessageRole = "USER" | "ASSISTANT";

export interface FaqMessage {
  id: number;
  conversationId: number;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface FaqConversation {
  id: number;
  userId: string;
  title?: string | null;
  createdAt: string;
  updatedAt: string;
  messages: FaqMessage[];
  messageCount: number;
}

export type MessageRole = "USER" | "ASSISTANT";

export interface FaqMessage {
  id: number;
  conversationId: number;
  role: MessageRole;
  content: string;
  createdAt: Date;
}

export interface FaqConversation {
  id: number;
  userId: string;
  title?: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages: FaqMessage[];
  messageCount: number;
}

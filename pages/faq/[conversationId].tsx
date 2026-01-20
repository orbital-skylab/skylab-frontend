import FaqLayout from "@/components/layout/Faq";
import { ApiServiceBuilder, consumeSSEStream } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";
import {
  GetFaqConversationResponse,
  HTTP_METHOD,
  PostFaqMessageResponse,
} from "@/types/api";
import {
  AddOutlined,
  ArrowDownwardOutlined,
  ArrowUpwardOutlined,
  KeyboardVoiceOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { FaqMessage } from "@/types/ai";
import useAutoScroll from "@/hooks/useAutoScroll";
import { Box, Button, IconButton, Input, Tooltip } from "@mui/material";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";

const INPUT_WARNING_LIMIT = 3000;
const INPUT_EXCEEDED_LIMIT = 4000;
const SHOW_SCROLL_DOWN_BUTTON_THRESHOLD = 350;

const Conversation = () => {
  const router = useRouter();
  const { draft, conversationId } = router.query;
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [tempUserMessage, setTempUserMessage] = useState("");
  const [messages, setMessages] = useState<FaqMessage[]>([]);
  const [tempAssistantMessage, setTempAssistantMessage] = useState("");
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);
  const charCount = input.length;
  const isInputLimitExceeded = charCount > INPUT_EXCEEDED_LIMIT;

  const { data: conversationResponse } = useFetch<GetFaqConversationResponse>({
    endpoint: `/ai/faq/${conversationId}`,
    enabled: true,
  });
  const { containerRef, bottomRef } = useAutoScroll<HTMLDivElement>(
    [messages, tempAssistantMessage, isLoading],
    { threshold: 150 }
  );

  const appendToken = (chunk: string) => {
    setTempAssistantMessage((prev) => prev + chunk);
  };

  const finaliseMessage = (data: PostFaqMessageResponse) => {
    const { userMessage, assistantMessage } = data;
    setIsLoading(false);

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      assistantMessage,
    ]);

    setTempUserMessage("");
    setTempAssistantMessage("");
  };

  const postMessage = useCallback(
    async (content: string) => {
      setInput("");
      setTempAssistantMessage("");
      setIsLoading(true);
      setTempUserMessage(content);

      const apiService = new ApiServiceBuilder({
        method: HTTP_METHOD.POST,
        endpoint: `/ai/faq/${conversationId}/message`,
        body: { content },
        requiresAuthorization: true,
        stream: true,
      }).build();

      const response = await apiService();

      await consumeSSEStream(response, {
        onMessage: appendToken,
        onDone: finaliseMessage,
        onError: (err) => {
          console.error("Streaming error:", err);
          setIsLoading(false);
        },
      });
    },
    [conversationId]
  );

  const hasSentDraftRef = useRef(false);

  useEffect(() => {
    if (
      hasSentDraftRef.current ||
      typeof draft !== "string" ||
      draft.trim().length === 0
    ) {
      return;
    }

    hasSentDraftRef.current = true;

    postMessage(draft.trim());

    router.replace(`/faq/${conversationId}`, undefined, { shallow: true });
  }, [draft, conversationId, postMessage, router]);

  useEffect(() => {
    setMessages(conversationResponse?.faqConversation?.messages || []);
  }, [conversationId, conversationResponse]);

  useEffect(() => {
    const el = document.scrollingElement;
    if (!el) return;

    const onScroll = () => {
      const distanceFromBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight;

      setShowScrollDownButton(
        distanceFromBottom > SHOW_SCROLL_DOWN_BUTTON_THRESHOLD
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!conversationResponse) {
    return null;
  }

  return (
    <FaqLayout>
      <ConversationHeader
        title={conversationResponse?.faqConversation?.title ?? undefined}
      />
      {/* --- MESSAGE AREA --- */}
      <Box
        ref={containerRef}
        sx={{
          width: "100%",
          maxWidth: "720px",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",

          gap: "1.2rem",
          paddingBottom: "6rem",
        }}
      >
        {messages.map((msg) => {
          const isUser = msg.role === "USER";
          return <Message key={msg.id} content={msg.content} isUser={isUser} />;
        })}

        {/* Temporary user message */}
        {tempUserMessage && <Message isUser content={tempUserMessage} />}
        {/* Temporary assistant message */}
        {tempAssistantMessage && (
          <Message isUser={false} content={tempAssistantMessage} />
        )}
        {isLoading && <LoadingSpinner size={40} />}
      </Box>
      <Box ref={bottomRef} />
      {/* --- INPUT BAR --- */}
      <Box
        sx={{
          position: "fixed",
          bottom: "24px",
          left: "300px",
          right: 0,
          display: "flex",
          justifyContent: "center",
          pointerEvents: "none",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "760px",
            borderRadius: "999px",
            padding: "0.7rem",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            background: "#f5f5f5",
            boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)",
            pointerEvents: "auto",
            border: "1px solid #e0e0e0",
          }}
        >
          <Tooltip title="Add attachments">
            <IconButton>
              <AddOutlined />
            </IconButton>
          </Tooltip>
          <Input
            type="text"
            placeholder="Ask a question"
            value={input}
            disabled={isLoading}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                postMessage(input);
                setInput("");
              }
            }}
            sx={{
              flexGrow: 1,
              border: "none",
              outline: "none",
              fontSize: "1rem",
              background: "transparent",
            }}
          />

          <Tooltip title="Voice">
            <IconButton>
              <KeyboardVoiceOutlined />
            </IconButton>
          </Tooltip>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading || !input.trim() || isInputLimitExceeded}
            onClick={() => {
              postMessage(input);
            }}
            sx={{
              minWidth: 40,
              width: 40,
              height: 40,
              borderRadius: "50%",
              padding: 0,
              // enabled
              bgcolor: "#000",
              color: "#fff",

              "&:hover": {
                bgcolor: "#000",
              },

              // disabled
              "&.Mui-disabled": {
                bgcolor: "#e0e0e0",
                color: "#9e9e9e",
              },
            }}
          >
            <ArrowUpwardOutlined />
          </Button>
        </Box>
        {charCount > INPUT_WARNING_LIMIT && (
          <Box
            sx={{
              marginTop: "6px",
              marginLeft: "32px",
              width: "100%",
              maxWidth: "760px",
              textAlign: "left",
              fontSize: "0.80rem",
              fontWeight: 500,
              color: charCount > INPUT_EXCEEDED_LIMIT ? "#d32f2f" : "#515151",
              paddingRight: "12px",
              pointerEvents: "auto",
            }}
          >
            {charCount} / {INPUT_EXCEEDED_LIMIT}
            {charCount <= INPUT_EXCEEDED_LIMIT && (
              <Box component="span" sx={{ marginLeft: 6 }}>
                · Consider shortening for clearer answers
              </Box>
            )}
            {charCount > INPUT_EXCEEDED_LIMIT && (
              <Box component="span" sx={{ marginLeft: 6 }}>
                · Message is too long, please shorten it
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          position: "fixed",
          bottom: "110px",
          textAlign: "center",
        }}
      >
        <IconButton
          onClick={() =>
            bottomRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "end",
            })
          }
          sx={{
            background: "rgba(235, 235, 235, 0.9)",
            color: "#2b2b2b",
            border: "1px solid rgba(0, 0, 0, 0.18)",
            zIndex: 1000,
            pointerEvents: showScrollDownButton ? "auto" : "none",
            opacity: showScrollDownButton ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          <ArrowDownwardOutlined />
        </IconButton>
      </Box>
    </FaqLayout>
  );
};

export default Conversation;

interface MessageProps {
  content: string;
  isUser: boolean;
}
const Message = ({ content, isUser }: MessageProps) => {
  return (
    <Box
      sx={{
        width: isUser ? "auto" : "100%",
        alignSelf: isUser ? "flex-end" : "stretch",
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Box
        sx={{
          background: isUser ? "#111" : "transparent",
          color: isUser ? "#fff" : "#111",
          padding: isUser ? "0.4rem 0.9rem" : "0",
          borderRadius: isUser ? "20px" : 0,
          fontSize: "0.95rem",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeSanitize]}
          components={{
            table({ children }) {
              return (
                <Box
                  component="table"
                  sx={{
                    width: "100%",
                    borderCollapse: "collapse",
                    margin: "0.75rem 0",
                    fontSize: "0.9rem",
                  }}
                >
                  {children}
                </Box>
              );
            },
            th({ children }) {
              return (
                <Box
                  component="th"
                  sx={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    background: "#f5f5f5",
                    fontWeight: 600,
                    textAlign: "left",
                  }}
                >
                  {children}
                </Box>
              );
            },
            td({ children }) {
              return (
                <Box
                  component="td"
                  sx={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    verticalAlign: "top",
                  }}
                >
                  {children}
                </Box>
              );
            },

            // existing renderers
            code({ inline, children }) {
              if (inline) {
                return (
                  <Box
                    component="code"
                    sx={{
                      background: "#eaeaea",
                      padding: "0.2em 0.4em",
                      borderRadius: "4px",
                      fontSize: "0.85em",
                    }}
                  >
                    {children}
                  </Box>
                );
              }

              return (
                <Box
                  component="pre"
                  sx={{
                    background: "#1e1e1e",
                    color: "#fff",
                    padding: "1rem",
                    borderRadius: "8px",
                    overflowX: "auto",
                    fontSize: "0.85em",
                  }}
                >
                  <Box component="code">{children}</Box>
                </Box>
              );
            },
            ul({ children }) {
              return (
                <Box component="ul" sx={{ paddingLeft: "1.2rem" }}>
                  {children}
                </Box>
              );
            },
            ol({ children }) {
              return (
                <Box component="ol" sx={{ paddingLeft: "1.2rem" }}>
                  {children}
                </Box>
              );
            },
            p({ children }) {
              return (
                <Box component="p" sx={{ margin: "0.4rem 0" }}>
                  {children}
                </Box>
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </Box>
    </Box>
  );
};

const ConversationHeader = ({ title }: { title?: string }) => {
  return (
    <Box
      sx={{
        position: "sticky",
        top: "4rem",
        zIndex: 10,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        pointerEvents: "none",
        padding: "0.6rem 1.1rem",
        color: "#5f5f5f",
      }}
    >
      <Box
        sx={{
          fontSize: "0.95rem",
          fontWeight: 600,

          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          pointerEvents: "auto",
        }}
      >
        {title ?? "Untitled Conversation"}
      </Box>
      <IconButton color="inherit" sx={{ pointerEvents: "auto" }}>
        <MoreHorizOutlined />
      </IconButton>
    </Box>
  );
};

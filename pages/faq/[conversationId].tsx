import FaqLayout from "@/components/layout/Faq";
import { ApiServiceBuilder, consumeSSEStream } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";
import {
  GetFaqConversationResponse,
  HTTP_METHOD,
  PostFaqMessageResponse,
} from "@/types/api";
import { ArrowDownwardOutlined } from "@mui/icons-material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaqMessage } from "@/types/ai";
import useAutoScroll from "@/hooks/useAutoScroll";
import { Box, IconButton } from "@mui/material";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import Body from "@/components/layout/Body";
import CustomHead from "@/components/layout/CustomHead";
import ConversationHeader from "@/components/faq/ConversationHeader";
import Message from "@/components/faq/Message";
import InputBar from "@/components/faq/InputBar";
import useFaq from "@/contexts/useFaq";
import { PAGES } from "@/helpers/navigation";

const SHOW_SCROLL_DOWN_BUTTON_THRESHOLD = 350;

const FaqConversation = () => {
  const { removeConversation } = useFaq();
  const router = useRouter();
  const hasSentDraftRef = useRef(false);
  const { draft, conversationId } = router.query;
  const [tempUserMessage, setTempUserMessage] = useState("");
  const [messages, setMessages] = useState<FaqMessage[]>([]);
  const [isLoadingMessage, setIsLoadingMessage] = useState(false);
  const [tempAssistantMessage, setTempAssistantMessage] = useState("");
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);

  const { data: conversationResponse } = useFetch<GetFaqConversationResponse>({
    endpoint: `/ai/faq/${conversationId}`,
    enabled: !!conversationId,
  });
  const { containerRef, bottomRef } = useAutoScroll<HTMLDivElement>(
    [messages, tempAssistantMessage, isLoadingMessage],
    { threshold: 150 }
  );
  const conversationTitle =
    conversationResponse?.faqConversation?.title ?? undefined;

  const appendToken = (chunk: string) => {
    setTempAssistantMessage((prev) => prev + chunk);
  };

  const finaliseMessage = (data: PostFaqMessageResponse) => {
    const { userMessage, assistantMessage } = data;
    setIsLoadingMessage(false);

    setMessages((prevMessages) => [
      ...prevMessages,
      userMessage,
      assistantMessage,
    ]);

    setTempUserMessage("");
    setTempAssistantMessage("");
  };

  const sendMessage = useCallback(
    async (content: string) => {
      setTempAssistantMessage("");
      setIsLoadingMessage(true);
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
          setIsLoadingMessage(false);
        },
      });
    },
    [conversationId]
  );

  const handleDeleteConversation = async () => {
    await removeConversation(Number(conversationId));
    router.replace(PAGES.FAQ);
  };

  // Send draft message if it exists
  useEffect(() => {
    if (
      hasSentDraftRef.current ||
      typeof draft !== "string" ||
      draft.trim().length === 0
    ) {
      return;
    }

    hasSentDraftRef.current = true;
    sendMessage(draft.trim());

    router.replace(`/faq/${conversationId}`, undefined, { shallow: true });
  }, [draft, conversationId, sendMessage, router]);

  // Load initial messages when conversationResponse changes
  useEffect(() => {
    if (conversationResponse?.faqConversation?.messages?.length) {
      setMessages(conversationResponse.faqConversation.messages);
    }
  }, [conversationId, conversationResponse]);

  // Show/hide scroll down button based on scroll position
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

  if (
    !conversationResponse?.faqConversation ||
    typeof conversationId !== "string"
  ) {
    return null;
  }

  return (
    <Body
      isLoading={false}
      sx={{
        position: "relative",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <CustomHead
        title={conversationTitle}
        description={`A conversation about ${conversationTitle} with Skylab's AI-Powered FAQ Assistant`}
      />
      <ConversationHeader
        title={conversationTitle}
        onDelete={handleDeleteConversation}
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
        {/* --- TEMPORARY USER MESSAGE --- */}
        {tempUserMessage && <Message isUser content={tempUserMessage} />}
        {/* --- TEMPORARY ASSISTANT MESSAGE --- */}
        {tempAssistantMessage && (
          <Message isUser={false} content={tempAssistantMessage} />
        )}
        {isLoadingMessage && <LoadingSpinner size={35} />}
      </Box>
      <Box ref={bottomRef} />
      {/* --- INPUT BAR --- */}
      <InputBar isLoadingMessage={isLoadingMessage} onSend={sendMessage} />
      {/* --- SCROLL DOWN BUTTON --- */}
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
    </Body>
  );
};

FaqConversation.getLayout = (page: React.ReactNode) => (
  <FaqLayout>{page}</FaqLayout>
);

export default FaqConversation;

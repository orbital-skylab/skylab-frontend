import FaqLayout from "@/components/layout/Faq/Faq";
import { ApiServiceBuilder, consumeSSEStream } from "@/helpers/api";
import useFetch from "@/hooks/useFetch";
import { GetFaqConversationResponse, HTTP_METHOD } from "@/types/api";
import { Add, AttachFile, KeyboardVoice } from "@mui/icons-material";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { FaqMessage } from "@/types/ai";

const Conversation = () => {
    const router = useRouter();
    const { draft, conversationId } = router.query;

    const [input, setInput] = useState("");
    const [tempMessage, setTempMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { data: conversationResponse } =
        useFetch<GetFaqConversationResponse>({
            endpoint: `/ai/faq/${conversationId}`,
            enabled: true,
        });

    const [messages, setMessages] = useState<FaqMessage[]>([])


    const appendToken = (chunk: string) => {
        setTempMessage((prev) => prev + chunk);
    };

    const finaliseMessage = (chunk: string) => {
        const { userMessage, assistantMessage } = JSON.parse(chunk);

        setIsLoading(false);

        setMessages((prevMessages) => {
            const trimmedMessages = [...prevMessages];
            for (let i = trimmedMessages.length - 1; i >= 0; i--) {
                if (trimmedMessages[i].role === "USER") {
                    trimmedMessages.splice(i, 1);
                    break;
                }
            }

            return [
                ...trimmedMessages,
                userMessage,
                assistantMessage,
            ];
        });

        setTempMessage("");
    };

    const postMessage = useCallback(
        async (content: string) => {
            setTempMessage("");
            setIsLoading(true);
            const userMessage = { content, role: "USER", createdAt: new Date(), conversationId: Number(conversationId) } as FaqMessage
            setMessages(messages => [...messages, userMessage])

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

    // 🔹 Auto-send draft on first load
    useEffect(() => {
        if (typeof draft === "string" && draft.length > 0) {
            postMessage(draft);

            // clean URL so refresh doesn't resend
            router.replace(`/faq/${conversationId}`, undefined, { shallow: true });
        }
    }, [draft, conversationId, postMessage, router]);

    useEffect(() => {
        setMessages(conversationResponse?.faqConversation?.messages || [])
    }, [conversationResponse?.faqConversation?.messages])

    return (
        <FaqLayout>
            {/* --- MESSAGE AREA --- */}
            <div
                style={{
                    width: "100%",
                    maxWidth: "720px",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: "1.2rem",
                    paddingBottom: "6rem",
                }}
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            alignSelf: msg.role === "USER" ? "flex-end" : "flex-start",
                            background: msg.role === "USER" ? "#111" : "#f2f2f2",
                            color: msg.role === "USER" ? "#fff" : "#111",
                            padding: "0.9rem 1.2rem",
                            borderRadius: "12px",
                            fontSize: "0.95rem",
                            lineHeight: 1.5,
                            maxWidth: "85%",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        <Message content={msg.content} /></div>
                ))}
                {/* Assistant streaming message */}
                {(tempMessage || isLoading) && (
                    <div
                        style={{
                            alignSelf: "flex-start",
                            background: "#f2f2f2",
                            color: "#111",
                            padding: "0.9rem 1.2rem",
                            borderRadius: "12px",
                            fontSize: "0.95rem",
                            lineHeight: 1.5,
                            maxWidth: "85%",
                            whiteSpace: "pre-wrap",
                        }}
                    >
                        {tempMessage ? <Message content={tempMessage} /> : <Loading />}
                    </div>
                )}
            </div>

            {/* --- INPUT BAR --- */}
            < div
                style={{
                    position: "fixed",
                    bottom: "24px",
                    left: "300px",
                    right: 0,
                    display: "flex",
                    justifyContent: "center",
                    pointerEvents: "none",
                }}
            >
                <div
                    style={{
                        width: "100%",
                        maxWidth: "760px",
                        borderRadius: "999px",
                        padding: "0.85rem 1.25rem",
                        display: "flex",
                        gap: "0.75rem",
                        alignItems: "center",
                        background: "#f2f2f2",
                        boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.08)",
                        pointerEvents: "auto",
                    }}
                >
                    <AttachFile style={{ fontSize: "1.3rem", opacity: 0.7 }} />
                    <Add style={{ fontSize: "1.4rem", opacity: 0.75 }} />

                    <input
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
                        style={{
                            flexGrow: 1,
                            border: "none",
                            outline: "none",
                            fontSize: "1rem",
                            background: "transparent",
                        }}
                    />

                    <KeyboardVoice style={{ fontSize: "1.4rem", opacity: 0.75 }} />

                    <button
                        disabled={isLoading || !input.trim()}
                        onClick={() => {
                            postMessage(input);
                            setInput("");
                        }}
                        style={{
                            padding: "6px 16px",
                            border: "none",
                            background: "#000",
                            color: "#fff",
                            borderRadius: "999px",
                            cursor: "pointer",
                            fontWeight: 500,
                            opacity: isLoading ? 0.6 : 1,
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>
        </FaqLayout>
    );
};

export default Conversation;


const Loading = () => {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <span style={{ opacity: 0.6 }}>
            Thinking{dots}
        </span>
    );
};

const Message = ({ content }: { content: string }) => {
    return <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
            code({ inline, children }) {
                if (inline) {
                    return (
                        <code
                            style={{
                                background: "#eaeaea",
                                padding: "0.2em 0.4em",
                                borderRadius: "4px",
                                fontSize: "0.85em",
                            }}
                        >
                            {children}
                        </code>
                    );
                }

                return (
                    <pre
                        style={{
                            background: "#1e1e1e",
                            color: "#fff",
                            padding: "1rem",
                            borderRadius: "8px",
                            overflowX: "auto",
                            fontSize: "0.85em",
                        }}
                    >
                        <code>{children}</code>
                    </pre>
                );
            },
            ul({ children }) {
                return <ul style={{ paddingLeft: "1.2rem" }}>{children}</ul>;
            },
            ol({ children }) {
                return <ol style={{ paddingLeft: "1.2rem" }}>{children}</ol>;
            },
            p({ children }) {
                return <p style={{ margin: "0.4rem 0" }}>{children}</p>;
            },
        }}
    >
        {content}
    </ReactMarkdown>
}
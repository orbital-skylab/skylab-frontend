import useFetch from "@/hooks/useFetch";
import { GetFaqConversationsResponse } from "@/types/api";
import { useRouter } from "next/router";
import React from "react";

type FaqLayoutProps = {
    children: React.ReactNode;
};

const SIDEBAR_WIDTH = 300;
const TOP_OFFSET = "3rem";
const INPUT_BAR_SPACE = "120px"; // reserve space for floating input

const Faq = ({ children }: FaqLayoutProps) => {
    const router = useRouter();

    const { data: conversationsResponse, status } =
        useFetch<GetFaqConversationsResponse>({
            endpoint: `/ai/faq`,
            enabled: true,
        });

    const conversations = conversationsResponse?.faqConversations ?? [];

    return (
        <div
            style={{
                minHeight: `calc(100vh - ${TOP_OFFSET})`,
                fontFamily: "Inter, sans-serif",
                color: "#111",
                marginTop: TOP_OFFSET,
            }}
        >
            {/* --- LEFT SIDEBAR (FIXED) --- */}
            <div
                style={{
                    position: "fixed",
                    top: TOP_OFFSET,
                    left: 0,
                    width: `${SIDEBAR_WIDTH}px`,
                    height: `calc(100vh - ${TOP_OFFSET})`,
                    borderRight: "1px solid #e0e0e0",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    background: "#fafafa",
                    overflowY: "auto", // ✅ sidebar only
                }}
            >
                <h4 style={{ margin: 0, fontWeight: 600 }}>History</h4>

                {status === "FETCHING" && (
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>
                        Loading conversations…
                    </div>
                )}

                {status === "FETCHED" && conversations.length === 0 && (
                    <div style={{ fontSize: "0.85rem", color: "#666" }}>
                        No conversations yet
                    </div>
                )}

                {conversations.map((conv) => (
                    <div
                        key={conv.id}
                        onClick={() => router.push(`/faq/${conv.id}`)}
                        style={{
                            padding: "0.75rem",
                            borderRadius: "8px",
                            background: "#fff",
                            border: "1px solid #ddd",
                            cursor: "pointer",
                            fontSize: "0.9rem",
                            lineHeight: 1.4,
                            transition: "background 0.15s ease",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background = "#f5f5f5")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "#fff")
                        }
                    >
                        {conv.title ?? "Untitled conversation"}
                    </div>
                ))}
            </div>

            {/* --- MAIN CONTENT (BODY SCROLLS) --- */}
            <div
                style={{
                    marginLeft: `${SIDEBAR_WIDTH}px`,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: "4rem",
                    paddingBottom: INPUT_BAR_SPACE,
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default Faq;

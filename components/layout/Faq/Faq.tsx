import useFetch from "@/hooks/useFetch";
import { GetFaqConversationsResponse } from "@/types/api";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Add, Search, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Button, CircularProgress, IconButton } from "@mui/material";

type FaqLayoutProps = {
  children: React.ReactNode;
};

const SIDEBAR_WIDTH = 300;
const SIDEBAR_COLLAPSED_WIDTH = 64;
const TOP_OFFSET = "4rem";

const Faq = ({ children }: FaqLayoutProps) => {
  const router = useRouter();
  const { conversationId } = router.query;

  const { data, status } = useFetch<GetFaqConversationsResponse>({
    endpoint: `/ai/faq`,
    enabled: true,
  });

  const conversations = data?.faqConversations ?? [];

  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  return (
    <div
      style={{
        minHeight: `calc(100vh - ${TOP_OFFSET})`,
        marginTop: TOP_OFFSET,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ===== SIDEBAR ===== */}
      <div
        style={{
          position: "fixed",
          top: TOP_OFFSET,
          left: 0,
          width: sidebarWidth,
          height: `calc(100vh - ${TOP_OFFSET})`,
          borderRight: "1px solid #e0e0e0",
          background: "#fafafa",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease",
          overflowX: "hidden",
        }}
      >
        {/* --- TOP ACTIONS --- */}
        <div
          style={{
            padding: "0.75rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          {/* Collapse Toggle */}
          <IconButton
            onClick={() => setCollapsed((v) => !v)}
            style={{ alignSelf: collapsed ? "center" : "flex-end" }}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>

          {/* New Conversation */}
          {collapsed ? (
            <IconButton
              onClick={() => router.push("/faq")}
              sx={{
                alignSelf: "center",
                borderRadius: 2,
              }}
            >
              <Add fontSize="small" />
            </IconButton>
          ) : (
            <Button
              onClick={() => router.push("/faq")}
              variant="text"
              startIcon={<Add fontSize="small" />}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderRadius: 2,

                px: 1.5,
              }}
            >
              New conversation
            </Button>
          )}

          {/* Search */}
          {collapsed ? (
            <IconButton
              sx={{
                alignSelf: "center",
                borderRadius: 2,
              }}
            >
              <Search fontSize="small" />
            </IconButton>
          ) : (
            <Button
              variant="text"
              startIcon={<Search fontSize="small" />}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderRadius: 2,

                px: 1.5,
              }}
            >
              Conversations
            </Button>
          )}
        </div>

        {/* --- CONVERSATIONS --- */}
        {!collapsed && (
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "0rem",
            }}
          >
            <h4
              style={{
                margin: "0.5rem 0 0.25rem",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#6b6b6b",
                letterSpacing: "0.04em",
              }}
            >
              Recent Conversations
            </h4>

            {status === "FETCHING" && <CircularProgress />}

            {conversations.map((conv) => {
              const isActive = Number(conversationId) === conv.id;
              return <Button
                key={conv.id}
                variant="text"
                onClick={() => router.push(`/faq/${conv.id}`)}
                fullWidth
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  borderRadius: 2,
                  color: "text.primary",
                  px: 1.5,
                  backgroundColor:
                    isActive ? "#e5e5e5" : "transparent",

                  "&:hover": {
                    backgroundColor: "#eeeeee",
                  },
                }}
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    width: "100%",
                    textAlign: "left",
                    display: "block",
                  }}
                >
                  {conv.title ?? "Untitled conversation"}
                </span>
              </Button>
            })}
          </div>
        )}
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div
        style={{
          marginLeft: sidebarWidth,
          transition: "margin-left 0.2s ease",
          minHeight: `calc(100vh - ${TOP_OFFSET})`,
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Faq;

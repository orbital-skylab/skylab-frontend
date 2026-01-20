import useFetch from "@/hooks/useFetch";
import { GetFaqConversationsResponse } from "@/types/api";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Add, Search, ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Box, Button, CircularProgress, IconButton } from "@mui/material";
import { FaqConversation } from "@/types/ai";

type FaqLayoutProps = {
  children: React.ReactNode;
};

const SIDEBAR_WIDTH = 300;
const SIDEBAR_COLLAPSED_WIDTH = 64;
const TOP_OFFSET = "4rem";
const PAGE_SIZE = 25;
const SCROLL_THRESHOLD = 80;

const Faq = ({ children }: FaqLayoutProps) => {
  const router = useRouter();
  const { conversationId } = router.query;
  const conversationBoxRef = React.useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const [conversations, setAllConversations] = useState<FaqConversation[]>([]);
  const [hasMoreConversations, setHasMoreConversations] = useState(true);

  const { data, status, refetch } = useFetch<GetFaqConversationsResponse>({
    endpoint: `/ai/faq`,
    enabled: hasMoreConversations,
    queryParams: {
      limit: PAGE_SIZE,
      page,
      order: "desc",
    },
  });
  const sidebarWidth = collapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;

  useEffect(() => {
    refetch();
    setHasMoreConversations(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (!data?.faqConversations) {
      return;
    }
    setHasMoreConversations(data.hasMore);
    setAllConversations((prev) => {
      const existingIds = new Set(prev.map((c) => c.id));
      const uniqueIncoming = data.faqConversations.filter(
        (c) => !existingIds.has(c.id)
      );
      return [...prev, ...uniqueIncoming];
    });
  }, [data]);

  useEffect(() => {
    const el = conversationBoxRef.current;
    if (!el) return;

    const onScroll = () => {
      if (status === "FETCHING" || !hasMoreConversations) return;

      const { scrollTop, scrollHeight, clientHeight } = el;

      if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
        setPage((p) => p + 1);
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [status, hasMoreConversations]);

  return (
    <Box
      sx={{
        minHeight: `calc(100vh - ${TOP_OFFSET})`,
        marginTop: TOP_OFFSET,
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* ===== SIDEBAR ===== */}
      <Box
        sx={{
          position: "fixed",
          top: TOP_OFFSET,
          left: 0,
          width: sidebarWidth,
          height: `calc(100vh - ${TOP_OFFSET})`,
          background: "#f3f3f3",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease",
          overflowX: "hidden",
          padding: "0.4rem",
          gap: "1rem",
        }}
      >
        {/* --- TOP ACTIONS --- */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
          }}
        >
          {/* Collapse Toggle */}
          <IconButton
            onClick={() => setCollapsed((v) => !v)}
            sx={{ alignSelf: collapsed ? "center" : "flex-end" }}
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
        </Box>

        {/* --- CONVERSATIONS --- */}
        {!collapsed && (
          <Box
            ref={conversationBoxRef}
            sx={{
              flex: 1,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "0rem",
              alignItems: "center",
            }}
          >
            <Box
              component="h4"
              sx={{
                padding: "0.2rem 0.7rem",
                fontSize: "0.90rem",
                fontWeight: 600,
                color: "#6b6b6b",
                letterSpacing: "0.04em",
                textAlign: "left",
                width: "100%",
              }}
            >
              Recent Conversations
            </Box>
            {conversations.map((conv) => {
              const isActive = Number(conversationId) === conv.id;
              return (
                <Button
                  key={conv.id}
                  variant="text"
                  onClick={() => router.push(`/faq/${conv.id}`)}
                  fullWidth
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    borderRadius: 2,
                    color: "text.primary",
                    px: "0.7rem",
                    backgroundColor: isActive ? "#e5e5e5" : "transparent",

                    "&:hover": {
                      backgroundColor: "#eeeeee",
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      width: "100%",
                      textAlign: "left",
                      display: "block",
                    }}
                  >
                    {conv.title ?? "Untitled Conversation"}
                  </Box>
                </Button>
              );
            })}
            <CircularProgress
              sx={{ opacity: status === "FETCHING" ? 1 : 0 }}
            />
            {!hasMoreConversations && (
              <Box
                sx={{
                  padding: "0.5rem",
                  fontSize: "0.75rem",
                  color: "#999",
                }}
              >
                No more conversations
              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* ===== MAIN CONTENT ===== */}
      <Box
        sx={{
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
      </Box>
    </Box>
  );
};

export default Faq;
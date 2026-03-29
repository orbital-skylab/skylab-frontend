import React, { useMemo, useState } from "react";
import { useRouter } from "next/router";
import InfiniteScroll from "react-infinite-scroll-component";
import { Add, Search, ChevronLeft, ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  NAVBAR_HEIGHT_REM,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_EXPANDED_WIDTH,
} from "@/styles/constants";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import useFaq, { FaqProvider } from "@/contexts/useFaq";
import { PAGES } from "@/helpers/navigation";
import dayjs from "dayjs";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";

type FaqLayoutProps = {
  children: React.ReactNode;
};

/* ---------------- INNER LAYOUT ---------------- */
const FaqLayoutInner = ({ children }: FaqLayoutProps) => {
  const router = useRouter();
  const { conversationId } = router.query;

  const [collapsed, setCollapsed] = useState(false);

  const { conversations, isFetching, hasMore, loadMore } = useFaq();
  const recentConversations = useMemo(() => {
    return [...conversations].sort(
      (a, b) => +dayjs(b.updatedAt) - +dayjs(a.updatedAt)
    );
  }, [conversations]);

  const sidebarWidth = collapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_EXPANDED_WIDTH;

  return (
    <Box sx={{ minHeight: "100dvh", fontFamily: "Inter, sans-serif" }}>
      {/* --- SIDEBAR --- */}
      <Box
        sx={{
          position: "fixed",
          top: NAVBAR_HEIGHT_REM,
          left: 0,
          width: sidebarWidth,
          height: `calc(100dvh - ${NAVBAR_HEIGHT_REM})`,
          background: "#f3f3f3",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s ease",
          overflowX: "hidden",
          p: "0.4rem",
          gap: "0.5rem",
        }}
      >
        {/* --- TOP ACTIONS --- */}
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <IconButton
            onClick={() => setCollapsed((v) => !v)}
            sx={{ alignSelf: collapsed ? "center" : "flex-end" }}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>

          {collapsed ? (
            <Tooltip title="New Conversation" placement="right">
              <IconButton
                onClick={() => router.push(PAGES.FAQ)}
                sx={{ alignSelf: "center", borderRadius: 2 }}
              >
                <Add fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              onClick={() => router.push(PAGES.FAQ)}
              startIcon={<Add fontSize="small" />}
              fullWidth
              sx={{
                justifyContent: "flex-start",
                textTransform: "none",
                borderRadius: 2,
                px: 1.5,
              }}
            >
              New Conversation
            </Button>
          )}

          {collapsed ? (
            <Tooltip title="Search Conversations" placement="right">
              <IconButton
                onClick={() => router.push(`${PAGES.FAQ}/conversations`)}
                sx={{ alignSelf: "center", borderRadius: 2 }}
              >
                <Search fontSize="small" />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              onClick={() => router.push(`${PAGES.FAQ}/conversations`)}
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

        {/* --- CONVERSATION LIST --- */}
        {!collapsed && (
          <NoDataWrapper
            noDataCondition={
              recentConversations.length === 0 && !isFetching && !hasMore
            }
            fallback={<NoneFound title="No Conversations Yet" message="" />}
          >
            <Box
              id="conversation-scroll"
              sx={{
                flex: 1,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography
                sx={{
                  p: "0.4rem 0.7rem",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#6b6b6b",
                  letterSpacing: "0.04em",
                  width: "100%",
                }}
              >
                Recent Conversations
              </Typography>

              <InfiniteScroll
                dataLength={recentConversations.length}
                next={loadMore}
                hasMore={hasMore}
                loader={
                  <Box py={1} display="flex" justifyContent="center">
                    <LoadingSpinner size={30} />
                  </Box>
                }
                scrollableTarget="conversation-scroll"
                style={{ display: "flex", flexDirection: "column" }}
              >
                {recentConversations.map((conv) => {
                  const isActive = Number(conversationId) === conv.id;
                  return (
                    <Button
                      key={conv.id}
                      onClick={() => router.push(`${PAGES.FAQ}/${conv.id}`)}
                      fullWidth
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        borderRadius: 2,
                        px: "0.7rem",
                        backgroundColor: isActive ? "#e5e5e5" : "transparent",
                        "&:hover": { backgroundColor: "#eeeeee" },
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
                        }}
                      >
                        {conv.title ?? "Untitled Conversation"}
                      </Box>
                    </Button>
                  );
                })}
              </InfiniteScroll>

              {!isFetching && !hasMore && (
                <Box py={1} display="flex" justifyContent="center">
                  <Box textAlign="center" width="100%">
                    <Divider sx={{ my: 1 }} />
                    <Typography
                      color="text.secondary"
                      sx={{ fontSize: "0.9rem" }}
                    >
                      No more conversations
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
          </NoDataWrapper>
        )}
      </Box>

      {/* --- MAIN CONTENT --- */}
      <Box
        sx={{
          marginLeft: `${sidebarWidth}px`,
          transition: "margin-left 0.2s ease",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
          "--faq-sidebar-width": `${sidebarWidth}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

/* ---------------- OUTER LAYOUT ---------------- */
const FaqLayout = ({ children }: FaqLayoutProps) => {
  return (
    <FaqProvider>
      <FaqLayoutInner>{children}</FaqLayoutInner>
    </FaqProvider>
  );
};

export default FaqLayout;

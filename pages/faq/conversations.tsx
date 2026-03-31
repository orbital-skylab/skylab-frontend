import FaqLayout from "@/components/layout/Faq/Faq";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useFaq from "@/contexts/useFaq";
import SearchInput from "@/components/search/SearchInput";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Typography,
  Stack,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  Add,
  MoreVert,
  ClearOutlined,
  DeleteForeverOutlined,
} from "@mui/icons-material";
import { useRouter } from "next/router";
import Body from "@/components/layout/Body";
import { timeAgo } from "@/helpers/dates";
import { PAGES } from "@/helpers/navigation";
import { NAVBAR_HEIGHT_REM } from "@/styles/constants";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";

const SCROLL_THRESHOLD = 120;
const FaqConversations = () => {
  const router = useRouter();
  const { conversations, removeConversations, isFetching, hasMore, loadMore } =
    useFaq();
  const conversationListRef = useRef<HTMLDivElement | null>(null);
  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const filteredConversations = useMemo(() => {
    if (!searchText.trim()) return conversations;
    return conversations.filter((c) =>
      (c.title ?? "Untitled Conversation")
        .toLowerCase()
        .trim()
        .includes(searchText.toLowerCase().trim())
    );
  }, [conversations, searchText]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    filteredConversations.length > 0 &&
    selectedIds.length === filteredConversations.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredConversations.map((c) => c.id));
    }
  };

  const handleNewConversation = () => {
    router.push("/faq");
  };

  const handleDeleteButtonClick = () => {
    if (!selectedIds.length) {
      return;
    }
    setOpenDeleteModal(true);
  };

  const handleBulkDelete = async () => {
    await removeConversations(selectedIds);
    setSelectedIds([]);
    setOpenDeleteModal(false);
  };

  useEffect(() => {
    const el = conversationListRef.current;
    if (!el) return;

    const onScroll = () => {
      if (!hasMore || isFetching) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
        loadMore();
      }
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [hasMore, isFetching, loadMore]);

  return (
    <Body sx={{ width: "100%", maxWidth: 900, paddingBottom: 0 }}>
      {/* ---------- HEADER ---------- */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mt={2}
        mb={3}
      >
        <Typography variant="h4" fontWeight={700}>
          Conversations
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewConversation}
          style={{ borderRadius: 9 }}
        >
          New Conversation
        </Button>
      </Stack>
      {/* ---------- SEARCH + ACTIONS ---------- */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        gap={2}
      >
        <SearchInput
          id="faq-search"
          label="Search conversations"
          onChange={setSearchText}
          fullWidth
        />
      </Stack>
      {/* ---------- LIST HEADER ---------- */}
      <Box
        sx={{
          position: "sticky",
          top: NAVBAR_HEIGHT_REM,
          zIndex: 10,
          backgroundColor: "background.paper",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyItems="space-between"
          px={1}
          py={1}
          color="#6b6b6b"
          height={46}
          borderBottom="1px solid rgba(0,0,0,0.08)"
        >
          <Tooltip title={isAllSelected ? "Deselect all" : "Select all"}>
            <Checkbox
              size="small"
              checked={isAllSelected}
              indeterminate={selectedIds.length > 0 && !isAllSelected}
              onChange={toggleSelectAll}
            />
          </Tooltip>
          {/* --- LIST HEADER TOOLBAR --- */}
          <Stack
            direction="row"
            justifyContent="space-between"
            style={{ width: "100%" }}
            ml={1}
          >
            {selectedIds.length > 0 ? (
              <>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Typography>{selectedIds.length} selected</Typography>
                  <Tooltip title={`Delete ${selectedIds.length} conversations`}>
                    <IconButton onClick={handleDeleteButtonClick}>
                      <DeleteForeverOutlined />
                    </IconButton>
                  </Tooltip>
                </Stack>
                <Tooltip title="Cancel">
                  <IconButton onClick={() => setSelectedIds([])}>
                    <ClearOutlined />
                  </IconButton>
                </Tooltip>
              </>
            ) : searchText ? (
              <Typography>
                {filteredConversations.length} matching conversations
              </Typography>
            ) : (
              <>
                <Typography>
                  {filteredConversations.length} conversations{" "}
                  {hasMore ? "loaded" : ""}
                </Typography>
              </>
            )}
          </Stack>
        </Stack>
      </Box>
      {/* ---------- CONVERSATION LIST ---------- */}

      <Box
        ref={conversationListRef}
        sx={{
          overflowY: "auto",
          maxHeight: `calc(100dvh - ${NAVBAR_HEIGHT_REM} - 185px)`,
        }}
      >
        {" "}
        <NoDataWrapper
          noDataCondition={
            conversations?.length === 0 && !hasMore && !isFetching
          }
          fallback={<NoneFound title="" message="" />}
        >
          <Stack divider={<Divider />}>
            {filteredConversations.map((conv) => {
              const isSelected = selectedIds.includes(conv.id);

              return (
                <Button
                  key={conv.id}
                  disableRipple={false}
                  onClick={() => router.push(`${PAGES.FAQ}/${conv.id}`)}
                  sx={{
                    justifyContent: "flex-start",
                    textTransform: "none",
                    px: 1,
                    py: 1,
                    borderRadius: 0,
                    backgroundColor: isSelected
                      ? "rgba(0,0,0,0.04)"
                      : "transparent",
                    "&:hover": {
                      backgroundColor: "rgba(0,0,0,0.06)",
                    },
                    "&:hover .menu": {
                      opacity: 1,
                    },
                  }}
                >
                  {/* Checkbox (stop propagation so it doesn't navigate) */}
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    onClick={(e) => e.stopPropagation()}
                    onChange={() => toggleSelect(conv.id)}
                  />

                  {/* Content */}
                  <Box pl={1} sx={{ flex: 1, textAlign: "left" }}>
                    <Typography fontSize="0.95rem" fontWeight={600} noWrap>
                      {conv.title ?? "Untitled Conversation"}
                    </Typography>

                    <Typography
                      fontSize="0.75rem"
                      color="text.secondary"
                      whiteSpace="pre-wrap"
                    >
                      {conv.messageCount ?? 0} messages · Updated{" "}
                      {conv.updatedAt ? timeAgo(conv.updatedAt) : "—"}
                    </Typography>
                  </Box>

                  <IconButton
                    size="small"
                    className="menu"
                    onClick={(e) => {
                      e.stopPropagation();
                      // menu logic later
                    }}
                    sx={{
                      opacity: 0,
                      transition: "opacity 0.15s ease",
                    }}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Button>
              );
            })}
            <Box py={3} display="flex" justifyContent="center">
              {isFetching && hasMore && <LoadingSpinner size={40} />}
              {!isFetching && !hasMore && (
                <Typography color="text.secondary">
                  No more conversations
                </Typography>
              )}
            </Box>
          </Stack>{" "}
        </NoDataWrapper>
      </Box>

      <ConfirmationModal
        open={openDeleteModal}
        onConfirm={handleBulkDelete}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Conversations"
        description={`You are deleting ${selectedIds.length} conversations.\n\nThis action is irreversible, are you sure?`}
      />
    </Body>
  );
};

FaqConversations.getLayout = (page: React.ReactNode) => (
  <FaqLayout>{page}</FaqLayout>
);

export default FaqConversations;

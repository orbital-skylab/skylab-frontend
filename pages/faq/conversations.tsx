import FaqLayout from "@/components/layout/Faq/Faq";
import React, { useMemo, useState } from "react";
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
} from "@mui/material";
import { Add, MoreVert, DeleteOutline } from "@mui/icons-material";
import { useRouter } from "next/router";
import Body from "@/components/layout/Body";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";

const FaqConversations = () => {
  const router = useRouter();
  const { conversations, isFetching } = useFaq();

  const [searchText, setSearchText] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /* ---------------- FILTERING ---------------- */
  const filteredConversations = useMemo(() => {
    if (!searchText.trim()) return conversations;
    return conversations.filter((c) =>
      (c.title ?? "Untitled Conversation")
        .toLowerCase()
        .trim()
        .includes(searchText.toLowerCase().trim())
    );
  }, [conversations, searchText]);

  /* ---------------- SELECTION ---------------- */
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

  /* ---------------- ACTIONS ---------------- */
  const handleNewConversation = () => {
    router.push("/faq");
  };

  const handleBulkDelete = () => {
    // UI-only for now
    console.log("Delete conversations:", selectedIds);
    setSelectedIds([]);
  };

  return (
    <Body sx={{ width: "100%", maxWidth: 900 }}>
      {/* ---------- HEADER ---------- */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography fontSize="1.4rem" fontWeight={700}>
          Conversations
        </Typography>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewConversation}
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
      <Stack
        direction="row"
        alignItems="center"
        px={1}
        py={0.5}
        color="#6b6b6b"
      >
        <Checkbox
          checked={isAllSelected}
          indeterminate={selectedIds.length > 0 && !isAllSelected}
          onChange={toggleSelectAll}
        />
        {selectedIds.length > 0 ? (
          <Button
            color="error"
            startIcon={<DeleteOutline />}
            onClick={handleBulkDelete}
            style={{
              flexShrink: 0,
              opacity: selectedIds.length > 0 ? 1 : 0,
              pointerEvents: selectedIds.length > 0 ? "auto" : "none",
            }}
            disabled={selectedIds.length === 0}
          >
            Delete ({selectedIds.length})
          </Button>
        ) : (
          <>
            <Typography fontSize="1rem" fontWeight={600}>
              {filteredConversations.length} conversations
            </Typography>
          </>
        )}
      </Stack>

      <Divider />

      {/* ---------- CONVERSATION LIST ---------- */}
      <Stack>
        {filteredConversations.map((conv) => {
          const isSelected = selectedIds.includes(conv.id);

          return (
            <Box
              key={conv.id}
              sx={{
                display: "flex",
                alignItems: "center",
                px: 1,
                py: 1,
                borderRadius: 2,
                cursor: "pointer",
                backgroundColor: isSelected
                  ? "rgba(0,0,0,0.04)"
                  : "transparent",
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.06)",
                },
              }}
            >
              <Checkbox
                checked={isSelected}
                onChange={() => toggleSelect(conv.id)}
              />

              <Box
                sx={{ flex: 1 }}
                onClick={() => router.push(`/faq/${conv.id}`)}
              >
                <Typography fontSize="0.95rem" fontWeight={600} noWrap>
                  {conv.title ?? "Untitled Conversation"}
                </Typography>

                <Typography fontSize="0.75rem" color="text.secondary">
                  {conv.messageCount ?? 0} messages ·{" "}
                  {conv.updatedAt
                    ? new Date(conv.updatedAt).toLocaleDateString()
                    : "—"}
                </Typography>
              </Box>

              <IconButton size="small">
                <MoreVert fontSize="small" />
              </IconButton>
            </Box>
          );
        })}
        <NoDataWrapper
          noDataCondition={filteredConversations.length === 0 && !isFetching}
          fallback={<NoneFound title="No Conversations Yet" message="" />}
        />
      </Stack>
    </Body>
  );
};

FaqConversations.getLayout = (page: React.ReactNode) => (
  <FaqLayout>{page}</FaqLayout>
);

export default FaqConversations;

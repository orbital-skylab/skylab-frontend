import ConversationMenu from "@/components/menus/ConversationMenu";
import ConfirmationModal from "@/components/modals/ConfirmationModal";
import { IosShareOutlined } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { memo, useState } from "react";

interface Props {
  title?: string;
  onDelete: () => void;
}
const ConversationHeader = memo(function ConversationHeader({
  title,
  onDelete,
}: Props) {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  return (
    <Box
      style={{
        position: "sticky",
        top: "4rem",
        zIndex: 10,
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0.6rem 0rem",
        color: "#5f5f5f",
      }}
    >
      <ConversationMenu
        title={title}
        onDelete={() => setOpenDeleteModal(true)}
        onRename={() => {
          return;
        }}
        onToggleStar={() => {
          return;
        }}
      />
      <Button
        startIcon={<IosShareOutlined />}
        sx={{ padding: "0.4rem 1.1rem", borderRadius: "12px" }}
      >
        Share
      </Button>
      <ConfirmationModal
        open={openDeleteModal}
        onConfirm={onDelete}
        onClose={() => setOpenDeleteModal(false)}
        title="Delete Conversation"
        description={`You are deleting the conversation ${title}.\n\nThis action is irreversible, are you sure?`}
      />
    </Box>
  );
});

export default ConversationHeader;

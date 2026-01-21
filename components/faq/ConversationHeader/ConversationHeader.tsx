import { MoreHorizOutlined } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { memo } from "react";

interface Props {
  title?: string;
}
const ConversationHeader = memo(function ConversationHeader({ title }: Props) {
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
        pointerEvents: "none",
        padding: "0.6rem 1.1rem",
        color: "#5f5f5f",
      }}
    >
      <Box
        style={{
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
});

export default ConversationHeader;

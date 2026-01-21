import MarkdownText from "@/components/typography/MarkdownText";
import { Box } from "@mui/material";
import { memo } from "react";

interface Props {
  content: string;
  isUser: boolean;
}
const Message = memo(function Message({ content, isUser }: Props) {
  return (
    <Box
      style={{
        width: isUser ? "auto" : "100%",
        alignSelf: isUser ? "flex-end" : "stretch",
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      <Box
        style={{
          maxWidth: "80%",
          background: isUser ? "#111" : "transparent",
          color: isUser ? "#fff" : "#111",
          padding: isUser ? "0.4rem 0.9rem" : "0",
          borderRadius: isUser ? "20px" : 0,
          fontSize: "0.95rem",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
        }}
      >
        <MarkdownText markdownContent={content} />
      </Box>
    </Box>
  );
});

export default Message;

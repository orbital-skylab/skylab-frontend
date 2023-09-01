import RichText from "@/components/typography/RichText";
import { timeAgo } from "@/helpers/dates";
import { AnnouncementComment } from "@/types/announcements";
import { Box, SxProps, Typography } from "@mui/material";
import { FC } from "react";

type Props = {
  comment: AnnouncementComment;
  sx?: SxProps;
};

const CommentContent: FC<Props> = ({ comment, sx }) => {
  return (
    <Box sx={sx}>
      <Typography fontSize="1rem" fontWeight={600}>
        {comment.author.name}
      </Typography>
      <Typography fontSize="0.75rem" mb="0.25rem">
        {timeAgo(comment.createdAt)}
      </Typography>
      <RichText htmlContent={comment.content} sx={{ fontSize: "0.875rem" }} />
    </Box>
  );
};
export default CommentContent;

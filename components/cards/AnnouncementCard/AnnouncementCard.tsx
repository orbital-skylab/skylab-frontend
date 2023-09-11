import { Announcement } from "@/types/announcements";
import { Badge, Card, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { timeAgo } from "@/helpers/dates";
import ActionLink from "@/components/typography/ActionLink";
import { useRouter } from "next/router";
import { PAGES } from "@/helpers/navigation";
import RichText from "@/components/typography/RichText";
import useApiCall, { isCalling } from "@/hooks/useApiCall";

type Props = { announcement: Announcement; announcementsRefetch: () => void };

const nonExpandedHeight = 85;

const AnnouncementCard: FC<Props> = ({
  announcement,
  announcementsRefetch,
}) => {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { call, status } = useApiCall({
    endpoint: `/announcements/${announcement.id}/read`,
    onSuccess: () => announcementsRefetch(),
  });

  const {
    id,
    title,
    author,
    content,
    createdAt,
    announcementReadLogs,
    _count,
  } = announcement;

  const isUnread = announcementReadLogs.length === 0;

  const announcementCard = (
    <Card sx={{ p: "1rem", width: "100%" }}>
      <Stack direction="row" alignItems="baseline" gap="0.5rem">
        <Typography fontSize="1.5rem">{title}</Typography>
        <Typography fontSize="0.75rem">{author.name}</Typography>
      </Stack>
      <Typography fontSize="0.75rem">{timeAgo(createdAt)}</Typography>
      <RichText
        sx={{
          my: "0.5rem",
          maxHeight: isExpanded ? "fit-content" : nonExpandedHeight,
          overflow: "hidden",
        }}
        htmlContent={content ?? ""}
      />
      <Stack direction="row" gap="0.75rem">
        <ActionLink
          onClick={() => {
            setIsExpanded(!isExpanded);
          }}
        >
          {isExpanded ? "Read less" : "Read more"}
        </ActionLink>
        <ActionLink
          onClick={() => {
            router.push(`${PAGES.ANNOUNCEMENTS}/${id}`);
          }}
        >
          {`Comments (${_count.announcementComments})`}
        </ActionLink>
        {isUnread ? (
          <ActionLink
            onClick={() => call()}
            sx={{
              marginLeft: "auto",
              color: "#D32F2F",
            }}
          >
            {isCalling(status) ? "Loading..." : "Mark as unread"}
          </ActionLink>
        ) : null}
      </Stack>
    </Card>
  );

  if (isUnread) {
    return (
      <Badge
        color="error"
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          outline: "1px solid #D32F2F",
        }}
        variant="dot"
      >
        {announcementCard}
      </Badge>
    );
  }

  return announcementCard;
};
export default AnnouncementCard;

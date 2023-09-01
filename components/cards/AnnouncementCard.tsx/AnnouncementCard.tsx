import { Announcement } from "@/types/announcements";
import { Card, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { timeAgo } from "@/helpers/dates";
import ActionLink from "@/components/typography/ActionLink";
import { useRouter } from "next/router";
import { PAGES } from "@/helpers/navigation";
import RichText from "@/components/typography/RichText";

type Props = { announcement: Announcement };

const nonExpandedHeight = 85;

const AnnouncementCard: FC<Props> = ({ announcement }) => {
  const router = useRouter();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  return (
    <Card sx={{ p: "1rem" }}>
      <Stack direction="row" alignItems="baseline" gap="0.5rem">
        <Typography fontSize="1.5rem">{announcement.title}</Typography>
        <Typography fontSize="0.75rem">{announcement.author.name}</Typography>
      </Stack>
      <Typography fontSize="0.75rem">
        {timeAgo(announcement.createdAt)}
      </Typography>
      <RichText
        sx={{
          my: "0.5rem",
          maxHeight: isExpanded ? "fit-content" : nonExpandedHeight,
          overflow: "hidden",
        }}
        htmlContent={announcement.content ?? ""}
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
            router.push(`${PAGES.ANNOUNCEMENTS}/${announcement.id}`);
          }}
        >
          {`Comments (${announcement._count.announcementComments})`}
        </ActionLink>
      </Stack>
    </Card>
  );
};
export default AnnouncementCard;

import { Announcement } from "@/types/announcements";
import { Card, Chip, Stack, Typography } from "@mui/material";
import { FC, useState } from "react";
import { timeAgo } from "@/helpers/dates";
import ActionLink from "@/components/typography/ActionLink";
import { useRouter } from "next/router";
import { PAGES } from "@/helpers/navigation";
import RichText from "@/components/typography/RichText";
import useFetch, { Mutate, isFetching } from "@/hooks/useFetch";
import {
  GetAnnouncementReadPercentageResponse,
  GetAnnouncementsResponse,
} from "@/types/api";
import LoadingSpinnerWithLabel from "@/components/emptyStates/LoadingSpinnerWithLabel";
import DeleteAnnouncementModal from "@/components/modals/DeleteAnnouncementModal";

type Props = {
  announcement: Announcement;
  mutate: Mutate<GetAnnouncementsResponse>;
};

const nonExpandedHeight = 85;

const ManageAnnouncementCard: FC<Props> = ({ announcement, mutate }) => {
  const router = useRouter();
  const [isDeleteAnnouncementModalOpen, setIsDeleteAnnouncementModalOpen] =
    useState(false);

  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { data, status } = useFetch<GetAnnouncementReadPercentageResponse>({
    endpoint: `/announcements/${announcement.id}/read-percentage`,
  });

  const { id, title, author, targetAudienceRole, content, createdAt, _count } =
    announcement;

  const handleOpenDeleteModal = () => setIsDeleteAnnouncementModalOpen(true);

  return (
    <>
      <DeleteAnnouncementModal
        open={isDeleteAnnouncementModalOpen}
        setOpen={setIsDeleteAnnouncementModalOpen}
        announcement={announcement}
        mutate={mutate}
      />
      <Card sx={{ p: "1rem", width: "100%" }}>
        <Stack direction="row" alignItems="baseline" gap="0.5rem">
          <Typography fontSize="1.5rem">{title}</Typography>
          <Typography fontSize="0.75rem">{author.name}</Typography>
          <Stack direction="row" alignItems="center" ml="auto">
            {isFetching(status) ? null : (
              <Stack direction="row" alignItems="center">
                <Typography fontSize="0.75rem">Read percentage:</Typography>
                <LoadingSpinnerWithLabel
                  value={data?.readPercentage.percentage ?? 0}
                />
              </Stack>
            )}
            <Chip
              label={`${targetAudienceRole}`}
              variant="outlined"
              size="small"
            />
          </Stack>
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
            id="view-announcement-comments-button"
            onClick={() => {
              router.push(`${PAGES.ANNOUNCEMENTS}/${id}`);
            }}
          >
            {`Comments (${_count.announcementComments})`}
          </ActionLink>
          <ActionLink
            id="edit-announcement-button"
            sx={{
              ml: "auto",
            }}
            onClick={() => {
              router.push(`${PAGES.MANAGE_ANNOUNCEMENTS}/${id}/edit`);
            }}
          >
            Edit
          </ActionLink>
          <ActionLink
            id="delete-announcement-button"
            sx={{
              color: "#D32F2F",
            }}
            onClick={handleOpenDeleteModal}
          >
            Delete
          </ActionLink>
        </Stack>
      </Card>
    </>
  );
};
export default ManageAnnouncementCard;

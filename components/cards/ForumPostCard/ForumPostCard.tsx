import React, { FC, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Avatar,
  IconButton,
  CardActions,
  Chip,
  CardActionArea,
  Menu,
  MenuItem,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ForumPost } from "@/types/forumpost";
import { PAGES } from "@/helpers/navigation";
import { formatCategory } from "@/helpers/forumpost";
import { Mutate } from "@/hooks/useFetch";
import Link from "next/link";
import { isoDateToLocaleDateWithTime } from "@/helpers/dates";
import useAuth from "@/contexts/useAuth";
import DeleteForumPostModal from "@/components/modals/DeleteForumPostModal";
import { GetForumPostsResponse } from "@/types/api";
import RichText from "@/components/typography/RichText";
import { useRouter } from "next/router";

type Props = {
  post: ForumPost;
  mutate: Mutate<GetForumPostsResponse>;
};

const ForumPostCard: FC<Props> = ({ post, mutate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuth();
  const router = useRouter();
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [isDeleteForumPostModalOpen, setIsDeleteForumPostModalOpen] =
    useState(false);

  const handleOpenDeleteModal = () => {
    setAnchorEl(null);
    setIsDeleteForumPostModalOpen(true);
  };

  const { id, title, body, userId, createdAt, category } = post;
  const profilePicUrl = post.user.profilePicUrl;
  const name = post.user.name;
  const isCreator = user?.id === userId;
  const handleEdit = () => {
    router.push(`${PAGES.FORUM}/${id}/edit`);
  };

  return (
    <>
      <DeleteForumPostModal
        open={isDeleteForumPostModalOpen}
        setOpen={setIsDeleteForumPostModalOpen}
        forumpost={post}
        mutate={mutate}
      />
      <Card
        sx={{
          maxWidth: 825,
          m: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <CardHeader
          avatar={<Avatar src={profilePicUrl} />}
          action={
            isCreator ? (
              <IconButton onClick={handleClick}>
                <MoreVertIcon />
              </IconButton>
            ) : null
          }
          title={<strong>{title}</strong>}
          subheader={`Created by ${name} on ${isoDateToLocaleDateWithTime(
            createdAt
          )}`}
        />
        <Link passHref href={`${PAGES.FORUM}/${id}`}>
          <CardActionArea component="a">
            <CardContent>
              <RichText
                sx={{
                  my: "0.5rem",
                  maxHeight: 85,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
                htmlContent={body ?? ""}
              />
            </CardContent>
            <CardActions
              disableSpacing
              sx={{ mt: "auto", justifyContent: "flex-end" }}
            >
              <Chip label={formatCategory(category)} variant="outlined" />
            </CardActions>
          </CardActionArea>
        </Link>
        <Menu
          id="post-card-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "post-card-button",
          }}
        >
          <MenuItem onClick={handleEdit}>
            <EditIcon fontSize="small" style={{ marginRight: "5px" }} />
            Edit
          </MenuItem>
          <MenuItem onClick={handleOpenDeleteModal}>
            <DeleteIcon fontSize="small" style={{ marginRight: "5px" }} />
            Delete
          </MenuItem>
        </Menu>
      </Card>
    </>
  );
};

export default ForumPostCard;

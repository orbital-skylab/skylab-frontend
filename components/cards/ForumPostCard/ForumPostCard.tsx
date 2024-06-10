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
  Box,
} from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ForumPost } from "@/types/forumpost";
import { PAGES } from "@/helpers/navigation";
import { formatCategory } from "@/helpers/forumpost";
import { Mutate } from "@/hooks/useFetch";
import { timeAgo } from "@/helpers/dates";
import useAuth from "@/contexts/useAuth";
import DeleteForumPostModal from "@/components/modals/DeleteForumPostModal";
import RichText from "@/components/typography/RichText";
import { useRouter } from "next/router";
import PushPinIcon from "@mui/icons-material/PushPin";
import useApiCall from "@/hooks/useApiCall";
import { HTTP_METHOD } from "@/types/api";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";

type Props = {
  post: ForumPost;
  mutate: Mutate<ForumPost[]>;
};

const ForumPostCard: FC<Props> = ({ post, mutate }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { user } = useAuth();
  const router = useRouter();
  const open = Boolean(anchorEl);
  const { setSuccess, setError } = useSnackbarAlert();

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
  const isAdmin = user?.administrator && user?.administrator.id !== undefined;

  const handleEdit = () => {
    router.push(`${PAGES.FORUM}/${id}/edit`);
  };

  const stickyForumPost = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/forumposts/sticky/${post.id}`,
    onSuccess: () => {
      mutate((currentPosts) => {
        if (!currentPosts) return [];
        const updatedPosts = currentPosts.map((p) =>
          p.id === post.id ? { ...p, isStickied: !p.isStickied } : p
        );
        return updatedPosts.sort((a, b) => {
          const stickyA = a.isStickied ? 1 : 0;
          const stickyB = b.isStickied ? 1 : 0;
          if (stickyB !== stickyA) return stickyB - stickyA;
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
      });
      setSuccess("Toggled sticky status");
    },
    onError: () => {
      setError(
        "An error occurred while stickying post. Please try again later"
      );
    },
  });

  const handleSticky = async () => {
    try {
      await stickyForumPost.call();
      setAnchorEl(null);
    } catch (error) {
      setError(error);
    }
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
          display: "flex",
          flexDirection: "column",
          maxHeight: "100%",
          backgroundColor: post.isStickied ? "#fffd8d" : "white",
        }}
      >
        <CardActionArea href={`${PAGES.FORUM}/${id}`}>
          <CardHeader
            avatar={<Avatar src={profilePicUrl} />}
            action={
              isCreator || isAdmin ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {post.isStickied ? (
                    <PushPinOutlinedIcon sx={{ transform: "rotate(45deg)" }} />
                  ) : null}
                  <IconButton
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      setAnchorEl(event.currentTarget);
                    }}
                  >
                    <MoreHorizIcon />
                  </IconButton>
                </Box>
              ) : null
            }
            title={<strong>{title}</strong>}
            subheader={`Created by ${name} ${timeAgo(createdAt)}`}
          />
          <CardContent>
            <RichText
              sx={{
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
        <Menu
          id="post-card-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "post-card-button",
          }}
        >
          {isAdmin && (
            <MenuItem onClick={handleSticky}>
              <PushPinIcon
                fontSize="small"
                sx={{ transform: "rotate(45deg)" }}
                style={{ marginRight: "5px" }}
              />
              Sticky
            </MenuItem>
          )}
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

import type { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
} from "@mui/material";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { GetForumPostResponse } from "@/types/api";
import CustomHead from "@/components/layout/CustomHead";
import GoBackButton from "@/components/buttons/GoBackButton";
import Body from "@/components/layout/Body";
import { formatCategory } from "@/helpers/forumpost";
import { timeAgo } from "@/helpers/dates";
import RichText from "@/components/typography/RichText";

const PostDetails: NextPage = () => {
  const router = useRouter();
  const { postId } = router.query;

  const { data: postResponse, status: getPostStatus } =
    useFetch<GetForumPostResponse>({
      endpoint: `/forumposts/${postId}`,
      enabled: !!postId,
    });

  const post = postResponse ? postResponse.forumPost : undefined;

  return (
    <>
      <CustomHead title={post?.title} />
      <Body isLoading={isFetching(getPostStatus)} loadingText="Loading post...">
        <GoBackButton />
        <Card sx={{ maxWidth: 1200, margin: "auto", mt: 4 }}>
          <CardHeader
            avatar={
              <Avatar src={post?.user.profilePicUrl} aria-label="recipe">
                {post?.user.name[0]}
              </Avatar>
            }
            title={post?.user.name}
            subheader={
              post?.createdAt ? timeAgo(post.createdAt) : "Unknown date"
            }
            action={
              <Chip
                label={formatCategory(post?.category ?? "Unknown")}
                variant="outlined"
              />
            }
            sx={{ paddingBottom: 0 }}
          />
          <CardContent>
            <Typography variant="h5" component="div" marginBottom={2}>
              {post?.title}
            </Typography>
            <RichText htmlContent={post?.body ?? ""} />
          </CardContent>
        </Card>
      </Body>
    </>
  );
};

export default PostDetails;

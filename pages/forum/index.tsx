import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Grid,
  Container,
  Stack,
  TextField,
  Button,
  Tabs,
  Tab,
  tabsClasses,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomHead from "@/components/layout/CustomHead";
import Body from "@/components/layout/Body";
import ForumPostCard from "@/components/cards/ForumPostCard";
import { PAGES } from "@/helpers/navigation";
import useFetch from "@/hooks/useFetch";
import { isError, isFetching } from "@/hooks/useFetch";
import { GetForumPostsResponse } from "@/types/api";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import { useState, useMemo, SyntheticEvent } from "react";
import { filterType } from "@/helpers/forumpost";

const Forum: NextPage = () => {
  type FilterTypeValue = (typeof filterType)[keyof typeof filterType];
  const router = useRouter();
  const [selectedPosts, setSelectedPosts] = useState<FilterTypeValue>(
    filterType.ALL
  );

  const memoQueryParams = useMemo(() => {
    return {
      category: selectedPosts,
    };
  }, [selectedPosts]);

  const {
    data: postsResponse,
    status: fetchPostsStatus,
    mutate: mutateForumPosts,
  } = useFetch<GetForumPostsResponse>({
    endpoint: `/forumposts`,
    enabled: true,
    queryParams: memoQueryParams,
  });

  const forumPosts = postsResponse?.forumPosts;

  const handleTabChange = (
    event: SyntheticEvent,
    newPostType: FilterTypeValue
  ) => {
    setSelectedPosts(newPostType);
  };

  return (
    <>
      <CustomHead title="Forum Posts" description="View forum discussions" />
      <Body isError={isError(fetchPostsStatus)}>
        <Container>
          <Stack
            sx={{
              maxWidth: "825px",
              width: "100%",
              margin: "auto",
              my: "0.5rem",
            }}
          >
            <Grid
              container
              spacing={2}
              justifyContent="space-between"
              alignItems="center"
            >
              <Grid item xs={12} sm={true}>
                <TextField
                  id="post-search-input"
                  label="Search"
                  size="small"
                  fullWidth
                />
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  size="medium"
                  id="create-post-button"
                  sx={{
                    textTransform: "none",
                    whiteSpace: "nowrap",
                    px: 2,
                  }}
                  onClick={() => {
                    router.push(PAGES.FORUM_CREATE_POST);
                  }}
                >
                  <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
                  NEW POST
                </Button>
              </Grid>
            </Grid>
            <Tabs
              value={selectedPosts}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="post-level-tabs"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{
                [`& .${tabsClasses.scrollButtons}`]: { color: "primary" },
                marginY: 2,
                width: "100%",
              }}
            >
              {Object.entries(filterType).map(([key, value]) => (
                <Tab
                  id={`${key.toLowerCase()}-tab`}
                  key={key}
                  value={value}
                  label={key}
                />
              ))}
            </Tabs>
          </Stack>
          <LoadingWrapper
            isLoading={
              (forumPosts === undefined || forumPosts.length === 0) &&
              isFetching(fetchPostsStatus)
            }
          >
            <NoDataWrapper
              noDataCondition={
                forumPosts === undefined || forumPosts.length === 0
              }
              fallback={<NoneFound message="No such posts found" />}
            >
              <Grid container spacing={{ xs: 2, md: 2 }}>
                {forumPosts?.map((post) => (
                  <Grid item key={post.id} xs={12}>
                    <ForumPostCard post={post} mutate={mutateForumPosts} />
                  </Grid>
                ))}
              </Grid>
            </NoDataWrapper>
          </LoadingWrapper>
        </Container>
      </Body>
    </>
  );
};

export default Forum;

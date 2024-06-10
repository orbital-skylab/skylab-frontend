import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  Grid,
  Container,
  Box,
  Tab,
  Tabs,
  TextField,
  Button,
  Stack,
  Typography,
  debounce,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import CustomHead from "@/components/layout/CustomHead";
import Body from "@/components/layout/Body";
import ForumPostCard from "@/components/cards/ForumPostCard";
import { PAGES } from "@/helpers/navigation";
import { isFetching } from "@/hooks/useFetch";
import { GetForumPostsResponse } from "@/types/api";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import NoneFound from "@/components/emptyStates/NoneFound";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import LoadingSpinner from "@/components/emptyStates/LoadingSpinner";
import {
  useState,
  useMemo,
  SyntheticEvent,
  useRef,
  useCallback,
  ChangeEvent,
} from "react";
import { filterType } from "@/helpers/forumpost";
import useInfiniteFetch, {
  createBottomOfPageRef,
} from "@/hooks/useInfiniteFetch";
import { ForumPost } from "@/types/forumpost";

const LIMIT = 30;

const Forum: NextPage = () => {
  type FilterTypeValue = typeof filterType[keyof typeof filterType];
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [selectedPosts, setSelectedPosts] = useState<FilterTypeValue>(
    filterType["ALL POSTS"]
  );
  const [searchTextInput, setSearchTextInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedQuerySearch = useCallback(
    debounce((val) => {
      setPage(0);
      setSearchQuery(val);
    }, 500),
    []
  );

  const handleSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTextInput(e.target.value);
    debouncedQuerySearch(e.target.value);
  };

  const memoQueryParams = useMemo(() => {
    return {
      category: selectedPosts,
      limit: LIMIT,
      searchQuery: searchQuery,
    };
  }, [selectedPosts, searchQuery]);

  const {
    data: postsResponse,
    status: fetchPostsStatus,
    mutate: mutateForumPosts,
    hasMore,
  } = useInfiniteFetch<GetForumPostsResponse, ForumPost>({
    endpoint: `/forumposts`,
    queryParams: memoQueryParams,
    page,
    responseToData: (response) => response.forumPosts,
    enabled: true,
  });

  const handleTabChange = (
    event: SyntheticEvent,
    newPostType: FilterTypeValue
  ) => {
    setSelectedPosts(newPostType);
    setPage(0);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const bottomOfPageRef = createBottomOfPageRef(
    isFetching(fetchPostsStatus),
    hasMore,
    setPage,
    observer
  );

  return (
    <>
      <CustomHead title="Forum Posts" description="View forum discussions" />
      <Body>
        <Container
          sx={{
            display: "flex",
            height: "75vh",
            borderTop: 1,
            borderColor: "divider",
            justifyContent: "flex-start",
            alignItems: "flex-start",
          }}
        >
          <Box
            sx={{
              overflowY: "auto",
              padding: 0,
              display: "flex",
              alignItems: "center",
              marginY: "6%",
            }}
          >
            <Tabs
              value={selectedPosts}
              onChange={handleTabChange}
              textColor="secondary"
              indicatorColor="secondary"
              aria-label="post-level-tabs"
              orientation="vertical"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              TabIndicatorProps={{ sx: { alignSelf: "flex-start" } }}
            >
              {Object.entries(filterType).map(([key, value]) => (
                <Tab
                  id={`${key.toLowerCase()}-tab`}
                  key={key}
                  value={value}
                  label={key}
                  sx={{
                    alignItems: "flex-start",
                    flexDirection: "column",
                    textAlign: "left",
                  }}
                />
              ))}
            </Tabs>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100vh",
              borderLeft: { xs: 0, md: 1 },
              borderColor: { md: "divider" },
            }}
          >
            <Container>
              <Stack
                sx={{
                  margin: "auto",
                  my: "0.5rem",
                  padding: 0.5,
                }}
              >
                <Grid
                  container
                  spacing={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Grid item xs={7} sm={8} md={9}>
                    {" "}
                    <TextField
                      id="post-search-input"
                      label="Search"
                      size="small"
                      fullWidth
                      value={searchTextInput}
                      onChange={handleSearchInputChange}
                    />
                  </Grid>
                  <Grid item xs={5} sm={4} md={3}>
                    {" "}
                    <Button
                      variant="outlined"
                      size="medium"
                      id="create-post-button"
                      sx={{
                        textTransform: "none",
                        whiteSpace: "nowrap",
                        px: 2,
                        width: "100%",
                      }}
                      onClick={() => router.push(PAGES.FORUM_CREATE_POST)}
                    >
                      <Add fontSize="small" sx={{ marginRight: "0.2rem" }} />
                      NEW POST
                    </Button>
                  </Grid>
                </Grid>
              </Stack>
              <Stack
                sx={{
                  margin: "auto",
                  my: "0.5rem",
                  height: "calc(85vh - 50px)",
                  padding: 0.5,
                  overflowY: "auto",
                  borderTop: 1,
                  borderColor: "divider",
                  width: "100%",
                }}
              >
                <LoadingWrapper
                  isLoading={
                    (postsResponse === undefined ||
                      postsResponse.length === 0) &&
                    isFetching(fetchPostsStatus)
                  }
                >
                  <NoDataWrapper
                    noDataCondition={
                      postsResponse === undefined || postsResponse.length === 0
                    }
                    fallback={<NoneFound message="No posts found" />}
                  >
                    <Grid container spacing={{ xs: 1, md: 2 }}>
                      {postsResponse?.map((post) => (
                        <Grid item key={post.id} xs={12}>
                          <ForumPostCard
                            post={post}
                            mutate={mutateForumPosts}
                          />
                        </Grid>
                      ))}
                    </Grid>
                    <div id="forum-ref" ref={bottomOfPageRef} />
                    <Box
                      sx={{
                        display: "grid",
                        placeItems: "center",
                        height: "100px",
                        width: "100%",
                      }}
                    >
                      {isFetching(fetchPostsStatus) ? (
                        <LoadingSpinner size={50} />
                      ) : !hasMore ? (
                        <Typography component="span" sx={{ marginTop: "10px" }}>
                          No more posts to show
                        </Typography>
                      ) : null}
                    </Box>
                  </NoDataWrapper>
                </LoadingWrapper>
              </Stack>
            </Container>
          </Box>
        </Container>
      </Body>
    </>
  );
};

export default Forum;

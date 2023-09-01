import GoBackButton from "@/components/buttons/GoBackButton";
import NoneFound from "@/components/emptyStates/NoneFound";
import RichTextEditor from "@/components/formikFormControllers/RichTextEditor";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import Body from "@/components/layout/Body";
import RichText from "@/components/typography/RichText";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import useAuth from "@/contexts/useAuth";
import { timeAgo } from "@/helpers/dates";
import { PAGES } from "@/helpers/navigation";
import useApiCall, { isCalling } from "@/hooks/useApiCall";
import useFetch, { isFetching } from "@/hooks/useFetch";
import { GetAnnouncementWithCommentThreadsResponse } from "@/types/api";
import { Box, Button, Stack, Typography } from "@mui/material";
import { Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";

type SubmitCommentFormValuesType = {
  content: string;
};

const Announcement: NextPage = () => {
  const router = useRouter();
  const { announcementId } = router.query;
  const { user } = useAuth();
  const {
    data: announcementResponse,
    status: announcementStatus,
    refetch,
  } = useFetch<GetAnnouncementWithCommentThreadsResponse>({
    endpoint: `/announcements/${announcementId}`,
    enabled: !!announcementId,
  });

  const announcement = announcementResponse
    ? announcementResponse.announcement
    : undefined;

  const { call, status } = useApiCall({
    endpoint: `/announcements/${announcementId}/comments`,
    onSuccess: () => {
      refetch();
    },
  });

  const handleSubmitComment = (values: SubmitCommentFormValuesType) => {
    call({ comment: { ...values, authorId: user?.id } });
  };

  return (
    <>
      <Body
        isLoading={isFetching(announcementStatus)}
        loadingText="Loading announcement..."
      >
        <NoDataWrapper
          noDataCondition={announcement === undefined}
          fallback={
            <NoneFound showReturnHome message="There is no such announcement" />
          }
        >
          <AutoBreadcrumbs
            breadcrumbs={[
              {
                label: `${announcement?.title}`,
                href: `${PAGES.ANNOUNCEMENTS}/${announcementId}`,
              },
            ]}
            replaceLast
          />
          <GoBackButton />
          <Stack direction="column" gap="2rem">
            <Box>
              <Stack direction="row" alignItems="baseline" gap="0.5rem">
                <Typography fontSize="2.5rem" fontWeight={600}>
                  {announcement?.title}
                </Typography>
                <Typography fontSize="1.5rem">
                  {announcement?.author.name}
                </Typography>
              </Stack>
              <Typography fontSize="1rem">
                {announcement?.createdAt
                  ? timeAgo(announcement?.createdAt)
                  : null}
              </Typography>
            </Box>
            <RichText htmlContent={announcement?.content ?? ""} />
            <Formik
              initialValues={{ content: "" } as SubmitCommentFormValuesType}
              onSubmit={handleSubmitComment}
            >
              {(formik) => (
                <form onSubmit={formik.handleSubmit}>
                  <Stack direction="column" gap="1rem">
                    <RichTextEditor name="content" formik={formik} />
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{ width: "fit-content" }}
                    >
                      {isCalling(status) ? "Loading..." : "Comment"}
                    </Button>
                  </Stack>
                </form>
              )}
            </Formik>
          </Stack>
        </NoDataWrapper>
      </Body>
    </>
  );
};
export default Announcement;

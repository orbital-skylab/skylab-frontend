import { NextPage } from "next";
// Components
import Dropdown from "@/components/formikFormControllers/Dropdown";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import Body from "@/components/layout/Body";
// Helpers
import * as Yup from "yup";
import { Formik } from "formik";
import { Announcement, targetAudienceRoles } from "@/types/announcements";
import { Button, Stack } from "@mui/material";
import TextInput from "@/components/formikFormControllers/TextInput";
import RichTextEditor from "@/components/formikFormControllers/RichTextEditor";
import useApiCall from "@/hooks/useApiCall";
import {
  GetAnnouncementWithCommentThreadsResponse,
  HTTP_METHOD,
} from "@/types/api";
import { useRouter } from "next/router";
import useFetch, { isFetching } from "@/hooks/useFetch";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";
import GoBackButton from "@/components/buttons/GoBackButton";

type EditAnnouncementFormValuesType = Partial<
  Pick<Announcement, "title" | "content" | "targetAudienceRole">
>;

const EditAnnouncement: NextPage = () => {
  const router = useRouter();
  const { announcementId } = router.query;
  const { setSuccess, setError } = useSnackbarAlert();

  const { data, status } = useFetch<GetAnnouncementWithCommentThreadsResponse>({
    endpoint: `/announcements/${announcementId}`,
  });

  const editAnnouncement = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/announcements/${announcementId}`,
    onSuccess: () => {
      setSuccess("Announcement edited successfully");
    },
    onError: () => {
      setError("Something went wrong while editing the announcement");
    },
  });

  const handleSubmit = async (values: EditAnnouncementFormValuesType) => {
    await editAnnouncement.call({
      announcement: {
        ...values,
      },
    });
  };

  const initialValues: EditAnnouncementFormValuesType = {
    title: data?.announcement.title ?? "",
    content: data?.announcement.content ?? "",
    targetAudienceRole: data?.announcement.targetAudienceRole ?? "All",
  };

  return (
    <>
      <Body
        isLoading={isFetching(status)}
        loadingText="Loading edit announcement..."
      >
        <AutoBreadcrumbs />
        <GoBackButton id="go-back-button" />
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={editAnnouncementValidationSchema}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <Stack gap="1rem">
                <Dropdown
                  label="Who should see the announcements?"
                  id="edit-announcement-target-audience-role-input"
                  name="targetAudienceRole"
                  formik={formik}
                  options={targetAudienceRoles.map((role) => ({
                    label: role,
                    value: role,
                  }))}
                />
                <TextInput
                  id="edit-announcement-title-input"
                  label="Title"
                  name="title"
                  formik={formik}
                />
                <RichTextEditor
                  id="edit-announcement-content-input"
                  label="Content"
                  name="content"
                  formik={formik}
                />
                <Button
                  id="edit-announcement-post-button"
                  variant="contained"
                  sx={{ width: "fit-content" }}
                  type="submit"
                >
                  Edit announcement
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
      </Body>
    </>
  );
};
export default EditAnnouncement;

const editAnnouncementValidationSchema = Yup.object().shape({
  targetAudienceRole: Yup.string()
    .oneOf(targetAudienceRoles as unknown as string[])
    .optional(),
  title: Yup.string().optional(),
  content: Yup.string().optional(),
});

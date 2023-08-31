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
import Checkbox from "@/components/formikFormControllers/Checkbox";
import useApiCall from "@/hooks/useApiCall";
import { CreateAnnouncementResponse } from "@/types/api";
import { useRouter } from "next/router";

type AddAnnouncementFormValuesType = Pick<
  Announcement,
  "title" | "content" | "targetAudienceRole"
> & { shouldSendEmail: boolean };

const AddAnnouncement: NextPage = () => {
  const router = useRouter();

  const addAnnouncement = useApiCall({
    endpoint: "/announcements",
    onSuccess: ({ announcement }: CreateAnnouncementResponse) => {
      router.push(`/announcements/${announcement.id}`);
    },
  });

  const handleSubmit = async (values: AddAnnouncementFormValuesType) => {
    await addAnnouncement.call(values);
  };

  const initialValues: AddAnnouncementFormValuesType = {
    targetAudienceRole: "All",
    title: "",
    content: "",
    shouldSendEmail: true,
  };
  return (
    <>
      <Body>
        <AutoBreadcrumbs />
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={addAnnouncementValidationSchema}
        >
          {(formik) => (
            <form onSubmit={formik.handleSubmit}>
              <Stack gap="1rem">
                <Dropdown
                  label="Who should see the announcements?"
                  name="targetAudienceRole"
                  formik={formik}
                  options={targetAudienceRoles.map((role) => ({
                    label: role,
                    value: role,
                  }))}
                />
                <TextInput label="Title" name="title" formik={formik} />
                <RichTextEditor
                  label="Content"
                  name="content"
                  formik={formik}
                />
                <Checkbox
                  label="Additionally send email to all target recipients"
                  name="shouldSendEmail"
                  formik={formik}
                />
                <Button
                  variant="contained"
                  sx={{ width: "fit-content" }}
                  type="submit"
                >
                  Post now
                </Button>
              </Stack>
            </form>
          )}
        </Formik>
      </Body>
    </>
  );
};
export default AddAnnouncement;

const addAnnouncementValidationSchema = Yup.object().shape({
  targetAudienceRole: Yup.string()
    .oneOf(targetAudienceRoles as unknown as string[])
    .required(),
  title: Yup.string().required(),
  content: Yup.string().required(),
  shouldSendEmail: Yup.boolean().required(),
});

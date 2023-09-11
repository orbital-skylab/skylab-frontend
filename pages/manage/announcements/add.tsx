import { NextPage } from "next";
// Components
import Dropdown from "@/components/formikFormControllers/Dropdown";
import AutoBreadcrumbs from "@/components/layout/AutoBreadcrumbs";
import Body from "@/components/layout/Body";
// Helpers
import * as Yup from "yup";
import { Formik } from "formik";
import { Announcement, targetAudienceRoles } from "@/types/announcements";
import { Button, MenuItem, Stack, TextField } from "@mui/material";
import TextInput from "@/components/formikFormControllers/TextInput";
import RichTextEditor from "@/components/formikFormControllers/RichTextEditor";
import Checkbox from "@/components/formikFormControllers/Checkbox";
import useApiCall from "@/hooks/useApiCall";
import { CreateAnnouncementResponse } from "@/types/api";
import { useRouter } from "next/router";
import useCohort from "@/contexts/useCohort";
import { Cohort } from "@/types/cohorts";
import { ChangeEvent, useEffect, useState } from "react";
import useAuth from "@/contexts/useAuth";
import useSnackbarAlert from "@/contexts/useSnackbarAlert";

type AddAnnouncementFormValuesType = Pick<
  Announcement,
  "title" | "content" | "targetAudienceRole"
> & { shouldSendEmail: boolean };

const AddAnnouncement: NextPage = () => {
  const { cohorts, currentCohortYear } = useCohort();
  const [selectedCohortYear, setSelectedCohortYear] = useState<
    Cohort["academicYear"] | string
  >("");
  const { setSuccess, setError } = useSnackbarAlert();
  const { user } = useAuth();

  const addAnnouncement = useApiCall({
    endpoint: "/announcements",
    onSuccess: () => {
      setSuccess("Announcement created successfully");
    },
    onError: () => {
      setError("Something went wrong while creating the announcement");
    },
  });

  const handleSubmit = async (values: AddAnnouncementFormValuesType) => {
    await addAnnouncement.call({
      announcement: {
        ...values,
        cohortYear: selectedCohortYear,
        authorId: user?.id,
      },
    });
  };

  const initialValues: AddAnnouncementFormValuesType = {
    targetAudienceRole: "All",
    title: "",
    content: "",
    shouldSendEmail: true,
  };

  /** Input Change Handlers */
  const handleCohortYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedCohortYear(Number(e.target.value) as Cohort["academicYear"]);
  };

  useEffect(() => {
    if (currentCohortYear) {
      setSelectedCohortYear(currentCohortYear);
    }
  }, [currentCohortYear]);

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
                <TextField
                  name="cohort"
                  label="Cohort"
                  value={selectedCohortYear}
                  onChange={handleCohortYearChange}
                  select
                  size="small"
                >
                  {cohorts &&
                    cohorts.map(({ academicYear }) => (
                      <MenuItem key={academicYear} value={academicYear}>
                        {academicYear}
                      </MenuItem>
                    ))}
                </TextField>
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

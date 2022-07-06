import type { NextPage } from "next";
// Components
import Body from "@/components/layout/Body";
import TextInput from "@/components/formikFormControllers/TextInput";
import SnackbarAlert from "@/components/SnackbarAlert";
import { Card, CardContent, Container, Stack, Typography } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import GoBackButton from "@/components/buttons/GoBackButton";
import Dropdown from "@/components/formikFormControllers/Dropdown";
import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
import NoneFound from "@/components/emptyStates/NoneFound";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
// Hooks
import useApiCall from "@/hooks/useApiCall";
import useSnackbarAlert from "@/hooks/useSnackbarAlert";
import { useRouter } from "next/router";
import useFetch, { isFetching } from "@/hooks/useFetch";
// Helpers
import { Formik } from "formik";
import { areAllEmptyValues, stripEmptyStrings } from "@/helpers/forms";
// Types
import { GetProjectResponse, GetUsersResponse, HTTP_METHOD } from "@/types/api";
import { LEVELS_OF_ACHIEVEMENT, Project } from "@/types/projects";

type EditProjectFormValues = Pick<
  Project,
  "name" | "achievement" | "proposalPdf"
> & { students: number[]; adviser: number | ""; mentor: number | "" };

const EditProject: NextPage = () => {
  const router = useRouter();
  const { projectId } = router.query;
  const { snackbar, handleClose, setSuccess, setError } = useSnackbarAlert();

  const { data: projectResponse, status: getProjectStatus } =
    useFetch<GetProjectResponse>({
      endpoint: `/projects/${projectId}`,
      enabled: !!projectId,
    });
  const project = projectResponse ? projectResponse.project : undefined;

  const initialValues: EditProjectFormValues = {
    name: project?.name ?? "",
    achievement: project?.achievement ?? LEVELS_OF_ACHIEVEMENT.VOSTOK,
    proposalPdf: project?.proposalPdf ?? "",
    students: project?.students
      ? project?.students.map(({ studentId }) => studentId)
      : [],
    adviser: project?.adviser?.adviserId ?? "",
    mentor: project?.mentor?.mentorId ?? "",
  };

  //TODO: Replace with lean routes
  /** Fetching student, adviser and mentor IDs and names for the dropdown select */
  const { data: studentsResponse } = useFetch<GetUsersResponse>({
    endpoint: `/users?cohortYear=${project?.cohortYear}&role=Student`,
    enabled: Boolean(!!project && project.cohortYear),
  });
  const { data: advisersResponse } = useFetch<GetUsersResponse>({
    endpoint: `/users?cohortYear=${project?.cohortYear}&role=Adviser`,
    enabled: Boolean(!!project && project.cohortYear),
  });
  const { data: mentorsResponse } = useFetch<GetUsersResponse>({
    endpoint: `/users?cohortYear=${project?.cohortYear}&role=Mentor`,
    enabled: Boolean(!!project && project.cohortYear),
  });

  const EditProject = useApiCall({
    method: HTTP_METHOD.PUT,
    endpoint: `/projects/${projectId}`,
  });

  const handleSubmit = async (values: EditProjectFormValues) => {
    const processedValues = stripEmptyStrings(values);
    try {
      await EditProject.call(processedValues);
      setSuccess("You have successfully edited your profile");
    } catch (error) {
      setError(error);
    }
  };

  return (
    <>
      <SnackbarAlert snackbar={snackbar} handleClose={handleClose} />
      <Body isLoading={isFetching(getProjectStatus)}>
        <NoDataWrapper
          noDataCondition={project === undefined}
          fallback={
            <NoneFound
              showReturnHome
              message="There is no such project with that project ID"
            />
          }
        >
          <GoBackButton />
          <Container maxWidth="sm" sx={{ padding: 0 }}>
            <Typography variant="h5" fontWeight={600} mb="1rem">
              {`Edit ${project?.name}'s Project`}
            </Typography>
            <Card>
              <CardContent>
                <Formik initialValues={initialValues} onSubmit={handleSubmit}>
                  {(formik) => {
                    return (
                      <form onSubmit={formik.handleSubmit}>
                        <Stack direction="column" spacing="1rem">
                          <TextInput
                            name="name"
                            label="Project Name"
                            formik={formik}
                          />
                          <Dropdown
                            name="achievement"
                            label="Level of Achievement"
                            formik={formik}
                            options={Object.values(LEVELS_OF_ACHIEVEMENT).map(
                              (option) => {
                                return { label: option, value: option };
                              }
                            )}
                          />
                          <MultiDropdown
                            name="students"
                            label="Student IDs"
                            formik={formik}
                            isCombobox
                            options={
                              studentsResponse && studentsResponse.users
                                ? studentsResponse.users.map((user) => {
                                    return {
                                      label: `${user?.student?.id}: ${user.name}`,
                                      value: user?.student?.id ?? 0,
                                    };
                                  })
                                : []
                            }
                          />
                          <Dropdown
                            name="adviser"
                            label="Adviser ID"
                            formik={formik}
                            isCombobox
                            options={
                              advisersResponse && advisersResponse.users
                                ? advisersResponse.users.map((user) => {
                                    return {
                                      label: `${user?.adviser?.id}: ${user.name}`,
                                      value: user?.adviser?.id ?? 0,
                                    };
                                  })
                                : []
                            }
                          />
                          <Dropdown
                            name="mentor"
                            label="Mentor ID"
                            formik={formik}
                            isCombobox
                            options={
                              mentorsResponse && mentorsResponse.users
                                ? mentorsResponse.users.map((user) => {
                                    return {
                                      label: `${user?.mentor?.id}: ${user.name}`,
                                      value: user?.mentor?.id ?? 0,
                                    };
                                  })
                                : []
                            }
                          />
                          <TextInput
                            name="proposalPdf"
                            label="Proposal PDF"
                            formik={formik}
                          />

                          <Stack direction="row" justifyContent="end">
                            <LoadingButton
                              type="submit"
                              variant="contained"
                              disabled={
                                areAllEmptyValues(formik.values) ||
                                snackbar.severity === "success"
                              }
                              loading={formik.isSubmitting}
                            >
                              Save
                            </LoadingButton>
                          </Stack>
                        </Stack>
                      </form>
                    );
                  }}
                </Formik>
              </CardContent>
            </Card>
          </Container>
        </NoDataWrapper>
      </Body>
    </>
  );
};
export default EditProject;

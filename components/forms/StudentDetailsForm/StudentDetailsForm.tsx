import Dropdown from "@/components/formikFormControllers/Dropdown";
import TextInput from "@/components/formikFormControllers/TextInput";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { Cohort } from "@/types/cohorts";
import { LeanProject } from "@/types/projects";
import { Typography } from "@mui/material";
import { FormikProps } from "formik";
import { FC } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>;
  cohorts?: Cohort[];
  leanProjects: LeanProject[] | undefined;
  isFetchingLeanProjects: boolean;
};

const StudentDetailsForm: FC<Props> = ({
  formik,
  cohorts,
  leanProjects,
  isFetchingLeanProjects,
}) => {
  return (
    <>
      {cohorts && cohorts.length && (
        <Dropdown
          label="Cohort"
          name="cohortYear"
          options={cohorts.map(({ academicYear }) => ({
            value: academicYear,
            label: academicYear,
          }))}
          size="small"
          formik={formik}
        />
      )}
      <TextInput
        id="student-nusnet-id-input"
        name="nusnetId"
        label="NUSNET ID"
        size="small"
        formik={formik}
      />
      <TextInput
        id="student-matric-no-input"
        name="matricNo"
        label="Matriculation Number"
        size="small"
        formik={formik}
      />
      <LoadingWrapper isLoading={isFetchingLeanProjects}>
        <NoDataWrapper
          noDataCondition={Boolean(leanProjects && !leanProjects.length)}
          fallback={<Typography>No projects found in this cohort</Typography>}
        >
          <Dropdown
            name="projectId"
            label="Project ID"
            formik={formik}
            isCombobox
            options={
              leanProjects
                ? leanProjects.map((leanProject) => {
                    return {
                      label: `${leanProject.id}: ${leanProject.name}`,
                      value: leanProject.id,
                    };
                  })
                : []
            }
          />
        </NoDataWrapper>
      </LoadingWrapper>
    </>
  );
};
export default StudentDetailsForm;

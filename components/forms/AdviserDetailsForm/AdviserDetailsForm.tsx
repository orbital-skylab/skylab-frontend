import Dropdown from "@/components/formikFormControllers/Dropdown";
import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
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

const AdviserDetailsForm: FC<Props> = ({
  formik,
  cohorts,
  leanProjects,
  isFetchingLeanProjects,
}) => {
  return (
    <>
      {cohorts && cohorts.length ? (
        <Dropdown
          label="Cohort"
          name="cohortYear"
          options={cohorts.map((cohort) => ({
            value: cohort.academicYear,
            label: cohort.academicYear,
          }))}
          size="small"
          formik={formik}
        />
      ) : null}
      <TextInput
        id="adviser-nusnet-id-input"
        name="nusnetId"
        label="NUSNET ID"
        size="small"
        formik={formik}
      />
      <TextInput
        id="adviser-matric-no-input"
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
          <MultiDropdown
            name="projectIds"
            label="Project IDs"
            isCombobox
            formik={formik}
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
export default AdviserDetailsForm;

import Dropdown from "@/components/formikFormControllers/Dropdown";
import TextInput from "@/components/formikFormControllers/TextInput";
import LoadingWrapper from "@/components/wrappers/LoadingWrapper";
import NoDataWrapper from "@/components/wrappers/NoDataWrapper";
import { Cohort } from "@/types/cohorts";
import { LeanTeam } from "@/types/teams";
import { Typography } from "@mui/material";
import { FormikProps } from "formik";
import { FC } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>;
  cohorts?: Cohort[];
  leanTeams: LeanTeam[] | undefined;
  isFetchingLeanTeams: boolean;
};

const StudentDetailsForm: FC<Props> = ({
  formik,
  cohorts,
  leanTeams,
  isFetchingLeanTeams,
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
        name="nusnetId"
        label="NUSNET ID"
        size="small"
        formik={formik}
      />
      <TextInput
        name="matricNo"
        label="Matriculation Number"
        size="small"
        formik={formik}
      />
      <LoadingWrapper isLoading={isFetchingLeanTeams}>
        <NoDataWrapper
          noDataCondition={Boolean(leanTeams && !leanTeams.length)}
          fallback={<Typography>No teams found in this cohort</Typography>}
        >
          <Dropdown
            name="teamId"
            label="Team ID"
            formik={formik}
            isCombobox
            options={
              leanTeams
                ? leanTeams.map((leanTeam) => {
                    return {
                      label: `${leanTeam.id}: ${leanTeam.name}`,
                      value: leanTeam.id,
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

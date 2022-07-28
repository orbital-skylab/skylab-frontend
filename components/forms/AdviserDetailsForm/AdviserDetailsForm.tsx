import Dropdown from "@/components/formikFormControllers/Dropdown";
import MultiDropdown from "@/components/formikFormControllers/MultiDropdown";
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

const AdviserDetailsForm: FC<Props> = ({
  formik,
  cohorts,
  leanTeams,
  isFetchingLeanTeams,
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
          <MultiDropdown
            name="teamIds"
            label="Team IDs"
            isCombobox
            formik={formik}
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
export default AdviserDetailsForm;

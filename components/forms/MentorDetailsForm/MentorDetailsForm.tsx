import Select from "@/components/formControllers/Select";
import { Cohort } from "@/types/cohorts";
import { FormikProps } from "formik";
import { FC } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>;
  cohorts: Cohort[];
};

const MentorDetailsForm: FC<Props> = ({ formik, cohorts }) => {
  return (
    <>
      <Select
        label="Cohort"
        name="cohortYear"
        options={cohorts.map((cohort) => ({
          value: cohort.academicYear,
          label: cohort.academicYear,
        }))}
        size="small"
        formik={formik}
      />
    </>
  );
};
export default MentorDetailsForm;

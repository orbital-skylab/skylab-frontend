import Select from "@/components/formControllers/Select";
import TextInput from "@/components/formControllers/TextInput";
import { Cohort } from "@/types/cohorts";
import { FormikProps } from "formik";
import { FC } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>;
  cohorts: Cohort[];
};

const AdviserDetailsForm: FC<Props> = ({ formik, cohorts }) => {
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
    </>
  );
};
export default AdviserDetailsForm;

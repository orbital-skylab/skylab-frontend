import TextInput from "@/components/formControllers/TextInput";
import { FormikProps } from "formik";
import { FC } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>;
};

const AdministratorDetailsForm: FC<Props> = ({ formik }) => {
  return (
    <>
      <TextInput
        name="startDate"
        type="datetime-local"
        label="Start Date"
        size="small"
        formik={formik}
      />
      <TextInput
        name="endDate"
        type="datetime-local"
        label="End Date"
        size="small"
        formik={formik}
      />
    </>
  );
};
export default AdministratorDetailsForm;

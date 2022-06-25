import TextInput from "@/components/formControllers/TextInput";
import { AddUserFormValuesType } from "@/components/modals/AddUserModal/AddUserModal";
import { FormikProps } from "formik";
import { FC } from "react";

type Props = {
  formik: FormikProps<AddUserFormValuesType>;
};

const AdviserDetailsForm: FC<Props> = ({ formik }) => {
  return (
    <>
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

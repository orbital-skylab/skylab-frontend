import TextInput from "@/components/formikFormControllers/TextInput";
import { FormikProps } from "formik";
import { FC } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formik: FormikProps<any>;
};

const UserDetailsForm: FC<Props> = ({ formik }) => {
  return (
    <>
      <TextInput name="name" label="Name" size="small" formik={formik} />
      <TextInput
        name="email"
        type="email"
        label="Email Address"
        size="small"
        formik={formik}
      />
    </>
  );
};
export default UserDetailsForm;

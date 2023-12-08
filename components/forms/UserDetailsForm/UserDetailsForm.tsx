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
      <TextInput
        id="user-name-input"
        name="name"
        label="Name"
        size="small"
        formik={formik}
      />
      <TextInput
        id="user-email-input"
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

import { FC } from "react";
import { TextField } from "@mui/material";
import { FormikProps } from "formik";
import { FormikSignInValues } from "@/types/formikValues";

type AllFormikValues = FormikSignInValues;

type Props = {
  label: string;
  name: keyof AllFormikValues;
  type?: "email" | "text" | "password";
  formik: FormikProps<AllFormikValues>;
};

const TextInput: FC<Props> = ({ label, type = "text", name, formik }) => {
  return (
    <TextField
      label={label}
      type={type}
      name={name}
      onChange={formik.handleChange}
      error={!!formik.errors[name]}
      helperText={formik.errors[name]}
    />
  );
};

export default TextInput;

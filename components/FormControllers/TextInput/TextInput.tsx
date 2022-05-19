import { TextField } from "@mui/material";
import { FormikProps } from "formik";

type Props<FormValuesType> = {
  label: string;
  name: keyof FormValuesType;
  type?: "email" | "text" | "password";
  formik: FormikProps<FormValuesType>;
  multiline?: boolean;
  minRows?: number;
};

function TextInput<FormValuesType>({
  label,
  type = "text",
  name,
  formik,
  multiline = false,
  minRows = 3,
}: Props<FormValuesType>) {
  return (
    <TextField
      label={label}
      type={type}
      name={name as string}
      onChange={formik.handleChange}
      error={!!formik.errors[name]}
      helperText={formik.errors[name]}
      multiline={multiline}
      minRows={minRows}
    />
  );
}

export default TextInput;

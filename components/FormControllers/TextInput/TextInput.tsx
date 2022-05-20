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
  const { values, errors, handleChange, handleBlur, touched } = formik;

  return (
    <TextField
      label={label}
      type={type}
      value={values[name]}
      name={name as string}
      onChange={handleChange}
      onBlur={handleBlur}
      error={!!errors[name] && !!touched[name]}
      helperText={errors[name]}
      multiline={multiline}
      minRows={minRows}
    />
  );
}

export default TextInput;
